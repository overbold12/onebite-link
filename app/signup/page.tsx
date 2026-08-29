import type { Metadata } from "next";
import { AuthPage } from "@/components/auth-page";
import { createPageMetadata } from "@/utils/metadata";

export const metadata: Metadata = createPageMetadata(
  "회원가입 | 한입 링크",
  "한입 링크 계정을 만들어 보세요.",
);

export default function SignupPage() {
  return <AuthPage mode="signup" />;
}
