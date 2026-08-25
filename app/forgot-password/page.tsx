import type { Metadata } from "next";
import { AuthPage } from "@/components/auth-page";

export const metadata: Metadata = {
  title: "비밀번호 찾기 | 한입 링크",
  description: "이메일로 비밀번호 재설정 링크를 받아보세요.",
};

type ForgotPasswordPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const { error } = await searchParams;

  return (
    <AuthPage
      mode="forgot-password"
      notice={
        error === "invalid_link"
          ? {
              tone: "error",
              message: "재설정 링크가 만료되었거나 유효하지 않습니다. 새 링크를 요청해 주세요.",
            }
          : undefined
      }
    />
  );
}
