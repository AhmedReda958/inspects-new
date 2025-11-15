"use client";

import { Card } from "@/components/ui/card";
import { LoginForm } from "./login-form";
import { useLogin } from "@/hooks/pages/use-login";

export function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Inspectex Admin</h1>
          <p className=" mt-2">Sign in to your account</p>
        </div>

        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          loading={loading}
          onSubmit={handleSubmit}
        />

        <div className="mt-6 text-center text-sm ">
          <p>Default credentials:</p>
          <p className="font-mono text-xs mt-1">
            admin@inspectex.com / admin123
          </p>
        </div>
      </Card>
    </div>
  );
}
