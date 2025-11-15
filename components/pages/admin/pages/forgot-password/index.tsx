"use client";

import { Card } from "@/components/ui/card";
import { ForgotPasswordForm } from "./forgot-password-form";
import { useForgotPassword } from "@/hooks/pages/use-forgot-password";

export function ForgotPasswordPage() {
  const { email, setEmail, error, success, loading, handleSubmit } =
    useForgotPassword();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Forgot Password</h1>
          <p className="mt-2">Enter your email to reset your password</p>
        </div>

        <ForgotPasswordForm
          email={email}
          setEmail={setEmail}
          error={error}
          success={success}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
}
