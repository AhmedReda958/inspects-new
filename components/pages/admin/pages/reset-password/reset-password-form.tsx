"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface ResetPasswordFormProps {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  error: string;
  success: boolean;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function ResetPasswordForm({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  error,
  success,
  loading,
  onSubmit,
}: ResetPasswordFormProps) {
  if (success) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          <p className="font-semibold mb-2">Password reset successfully!</p>
          <p>Your password has been reset. Redirecting to login page...</p>
        </div>
        <div className="text-center">
          <Link
            href="/admin/login"
            className="text-sm text-primary hover:underline"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          disabled={loading}
          minLength={6}
        />
        <p className="text-sm text-muted-foreground">
          Password must be at least 6 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="••••••••"
          disabled={loading}
          minLength={6}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Resetting..." : "Reset Password"}
      </Button>

      <div className="text-center">
        <Link
          href="/admin/login"
          className="text-sm text-primary hover:underline"
        >
          Back to login
        </Link>
      </div>
    </form>
  );
}

