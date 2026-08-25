import type { Metadata } from "next";
import { AuthPage } from "@/components/auth-page";

export const metadata: Metadata = {
  title: "로그인 | 한입 링크",
  description: "한입 링크에 로그인하세요.",
};

type LoginPageProps = {
  searchParams: Promise<{ password_updated?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { password_updated: passwordUpdated } = await searchParams;

  return (
    <AuthPage
      mode="login"
      notice={
        passwordUpdated === "1"
          ? {
              tone: "success",
              message: "비밀번호가 변경되었어요. 새 비밀번호로 로그인해 주세요.",
            }
          : undefined
      }
    />
  );
}
