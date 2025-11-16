import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import prisma from "./db";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d"; // Token expires in 7 days

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Generate JWT token for authenticated user
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token and return payload (Node.js runtime - for API routes)
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

/**
 * Verify JWT token in Edge Runtime (for middleware)
 * Uses jose library which is compatible with Edge Runtime
 */
export async function verifyTokenEdge(
  token: string
): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"], // Match the algorithm used by jsonwebtoken
    });

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch (error) {
    console.error("JWT Edge verification error:", error);
    return null;
  }
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare password with hashed password
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Extract token from Authorization header or cookies
 */
export function extractToken(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Check cookies
  const tokenFromCookie = request.cookies.get("admin_token")?.value;
  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  return null;
}

/**
 * Get authenticated user from request
 */
export async function getAuthUser(
  request: NextRequest
): Promise<AuthUser | null> {
  const token = extractToken(request);
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  // Fetch user from database
  const user = await prisma.adminUser.findUnique({
    where: { id: payload.userId, isActive: true },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  return user;
}

/**
 * Check if user has required role
 */
export function hasRole(user: AuthUser, allowedRoles: string[]): boolean {
  return allowedRoles.includes(user.role);
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: AuthUser; token: string } | null> {
  // Find user - explicitly select only needed fields to avoid issues with missing columns
  const user = await prisma.adminUser.findUnique({
    where: { email, isActive: true },
    select: {
      id: true,
      email: true,
      password: true,
      name: true,
      role: true,
      isActive: true,
    },
  });

  if (!user) {
    return null;
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  // Update last login
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  };
}

/**
 * Create audit log entry
 */
export async function createAuditLog(params: {
  userId: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  tableName: string;
  recordId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  await prisma.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      tableName: params.tableName,
      recordId: params.recordId,
      oldValues: params.oldValues,
      newValues: params.newValues,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    },
  });
}

/**
 * Generate secure random token for password reset
 * Uses Web Crypto API for Edge runtime compatibility
 */
export function generateResetToken(): string {
  // Use Web Crypto API which is available in both Node.js 18+ and Edge runtime
  // globalThis.crypto is the standard way to access Web Crypto API
  const webCrypto = globalThis.crypto;

  if (webCrypto && webCrypto.getRandomValues) {
    // Web Crypto API (Edge runtime compatible)
    const array = new Uint8Array(32);
    webCrypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }

  throw new Error("Web Crypto API is not available");
}

/**
 * Request password reset - generates token and stores it in database
 * Returns true if email exists (for security, always return true)
 */
export async function requestPasswordReset(email: string): Promise<boolean> {
  const user = await prisma.adminUser.findUnique({
    where: { email, isActive: true },
    select: {
      id: true,
      email: true,
    },
  });

  // Always return true for security (don't reveal if email exists)
  if (!user) {
    return true;
  }

  // Generate reset token
  const resetToken = generateResetToken();
  const resetTokenExpiresAt = new Date();
  resetTokenExpiresAt.setHours(resetTokenExpiresAt.getHours() + 1); // 1 hour expiration

  // Store token in database
  await prisma.adminUser.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiresAt,
    },
  });

  // Send password reset email (dynamic import to avoid Edge runtime issues)
  try {
    // Dynamic import to avoid loading nodemailer in Edge runtime
    const { sendPasswordResetEmail } = await import("./notifications");
    await sendPasswordResetEmail(user.email, resetToken);
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    // Still return true to not reveal if email exists
  }

  return true;
}

/**
 * Validate reset token - checks if token exists and hasn't expired
 */
export async function validateResetToken(
  token: string
): Promise<{ valid: boolean; userId?: string }> {
  const user = await prisma.adminUser.findUnique({
    where: { resetToken: token },
    select: { id: true, resetTokenExpiresAt: true },
  });

  if (!user || !user.resetTokenExpiresAt) {
    return { valid: false };
  }

  // Check if token has expired
  if (new Date() > user.resetTokenExpiresAt) {
    return { valid: false };
  }

  return { valid: true, userId: user.id };
}

/**
 * Reset password using token
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  // Validate token
  const validation = await validateResetToken(token);
  if (!validation.valid || !validation.userId) {
    return { success: false, error: "Invalid or expired reset token" };
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password and clear reset token
  await prisma.adminUser.update({
    where: { id: validation.userId },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  });

  return { success: true };
}
