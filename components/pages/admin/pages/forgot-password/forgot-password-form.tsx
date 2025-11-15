"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface ForgotPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  error: string;
  success: boolean;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function ForgotPasswordForm({
  email,
  setEmail,
  error,
  success,
  loading,
  onSubmit,
}: ForgotPasswordFormProps) {
  if (success) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          <p className="font-semibold mb-2">Email sent successfully!</p>
          <p>
            If an account with that email exists, a password reset link has been
            sent. Please check your email and click the link to reset your
            password.
          </p>
        </div>
        <div className="text-center">
          <Link
            href="/admin/login"
            className="text-sm text-primary hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <p className="text-sm text-muted-foreground">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Send Reset Link"}
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
