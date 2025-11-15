import { validateResetToken } from "@/lib/auth";
import { ResetPasswordPage } from "@/components/pages/admin/pages/reset-password";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    redirect("/admin/forgot-password");
  }

  // Validate token
  const validation = await validateResetToken(token);
  const isValid = validation.valid;

  return <ResetPasswordPage token={token} isValid={isValid} />;
}
