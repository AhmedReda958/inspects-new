"use client";

import { Card } from "@/components/ui/card";
import { ResetPasswordForm } from "./reset-password-form";
import { useResetPassword } from "@/hooks/pages/use-reset-password";

interface ResetPasswordPageProps {
  token: string;
  isValid: boolean;
}

export function ResetPasswordPage({ token, isValid }: ResetPasswordPageProps) {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    loading,
    handleSubmit,
  } = useResetPassword(token);

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">
              Invalid Reset Link
            </h1>
          </div>
          <div className="space-y-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              <p className="font-semibold mb-2">Invalid or expired token</p>
              <p>
                This password reset link is invalid or has expired. Please
                request a new password reset link.
              </p>
            </div>
            <div className="text-center">
              <a
                href="/admin/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Request new reset link
              </a>
            </div>
            <div className="text-center">
              <a
                href="/admin/login"
                className="text-sm text-primary hover:underline"
              >
                Back to login
              </a>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Reset Password</h1>
          <p className="mt-2">Enter your new password</p>
        </div>

        <ResetPasswordForm
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          error={error}
          success={success}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
}

