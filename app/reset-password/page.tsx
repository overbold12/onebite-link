import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthPage } from "@/components/auth-page";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "새 비밀번호 설정 | 한입 링크",
  description: "한입 링크 계정의 새 비밀번호를 설정하세요.",
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims?.sub) {
    redirect("/forgot-password?error=invalid_link");
  }

  return <AuthPage mode="reset-password" />;
}
