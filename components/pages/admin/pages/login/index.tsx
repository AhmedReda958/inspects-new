"use client";

import { Card } from "@/components/ui/card";
import { LoginForm } from "./login-form";
import { useLogin } from "@/hooks/pages/use-login";
import Image from "next/image";

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
        <Image
          src="/logo-full.svg"
          alt="Inspectex Logo"
          width={100}
          height={100}
          className="mx-auto "
        />
        <div className="text-center ">
          <h1 className="text-3xl font-bold text-primary">
            Inspectex Dashboard
          </h1>
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
      </Card>
    </div>
  );
}
