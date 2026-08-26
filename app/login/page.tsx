import type { Metadata } from "next";
import { AuthPage } from "@/components/auth-page";

export const metadata: Metadata = {
  title: "로그인 | 한입 링크",
  description: "한입 링크에 로그인하세요.",
};

type LoginPageProps = {
  searchParams: Promise<{
    auth_error?: string;
    password_updated?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const {
    auth_error: authError,
    password_updated: passwordUpdated,
  } = await searchParams;

  const notice =
    authError === "oauth_failed"
      ? {
          tone: "error" as const,
          message: "카카오 로그인을 완료하지 못했어요. 다시 시도해 주세요.",
        }
      : passwordUpdated === "1"
        ? {
            tone: "success" as const,
            message: "비밀번호가 변경되었어요. 새 비밀번호로 로그인해 주세요.",
          }
        : undefined;

  return (
    <AuthPage mode="login" notice={notice} />
  );
}
