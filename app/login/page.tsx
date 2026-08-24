import type { Metadata } from "next";
import { AuthPage } from "@/components/auth-page";

export const metadata: Metadata = {
  title: "로그인 | 한입 링크",
  description: "한입 링크에 로그인하세요.",
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
