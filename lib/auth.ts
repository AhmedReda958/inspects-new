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
  // Find user
  const user = await prisma.adminUser.findUnique({
    where: { email, isActive: true },
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
