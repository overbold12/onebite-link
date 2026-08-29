import Link from "next/link";
import { LinkIcon } from "./icons";
import { ForgotPasswordForm } from "./forgot-password-form";
import { LoginForm } from "./login-form";
import { ResetPasswordForm } from "./reset-password-form";
import { SignupForm } from "./signup-form";

type AuthPageProps = {
  mode: "login" | "signup" | "forgot-password" | "reset-password";
  notice?: {
    tone: "success" | "error";
    message: string;
  };
};

const authCopy = {
  login: {
    title: "다시 만나서 반가워요",
    description: "저장해 둔 링크를 이어서 관리해 보세요.",
    footerText: "아직 계정이 없나요?",
    footerLinkLabel: "회원가입",
    footerHref: "/signup",
  },
  signup: {
    title: "한입 링크 시작하기",
    description: "흩어진 링크를 한곳에 모아 간편하게 관리하세요.",
    footerText: "이미 계정이 있나요?",
    footerLinkLabel: "로그인",
    footerHref: "/login",
  },
  "forgot-password": {
    title: "비밀번호를 다시 설정해요",
    description: "가입한 이메일로 비밀번호 재설정 링크를 보내드릴게요.",
    footerText: "비밀번호가 기억났나요?",
    footerLinkLabel: "로그인",
    footerHref: "/login",
  },
  "reset-password": {
    title: "새 비밀번호를 입력해 주세요",
    description: "앞으로 사용할 새로운 비밀번호를 설정해 주세요.",
    footerText: "재설정 링크가 만료되었나요?",
    footerLinkLabel: "링크 다시 받기",
    footerHref: "/forgot-password",
  },
} as const;

export function AuthPage({ mode, notice }: AuthPageProps) {
  const copy = authCopy[mode];

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[var(--background)] px-5 py-10 sm:py-14">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[var(--auth-glow)] blur-3xl"
      />

      <section className="relative w-full max-w-[440px]" aria-labelledby="auth-title">
        <Link
          href="/"
          aria-label="한입 링크 홈"
          className="brand-link mx-auto mb-8 flex w-fit items-center gap-2.5 sm:mb-9"
        >
          <span className="brand-mark flex h-11 w-11 items-center justify-center rounded-[14px] bg-[var(--accent)] text-white shadow-[var(--shadow-button)]">
            <LinkIcon className="h-[22px] w-[22px]" />
          </span>
          <span className="text-[22px] font-extrabold tracking-[-0.045em] text-[var(--text)]">
            한입 링크
          </span>
        </Link>

        <div className="rounded-3xl bg-[var(--surface)] px-6 py-8 shadow-[var(--shadow-auth-card)] sm:px-9 sm:py-10">
          <div className="text-center">
            <h1
              id="auth-title"
              className="text-[26px] font-bold leading-[1.3] tracking-[-0.035em] text-[var(--text)]"
            >
              {copy.title}
            </h1>
            <p className="mt-2 text-[14px] leading-[1.55] text-[var(--text-sub)]">
              {copy.description}
            </p>
          </div>

          {notice ? (
            <p
              role={notice.tone === "error" ? "alert" : "status"}
              className={`mt-5 rounded-xl px-4 py-3 text-center text-[13px] font-semibold leading-5 ${
                notice.tone === "success"
                  ? "bg-[var(--success-surface)] text-[var(--success)]"
                  : "bg-[var(--error-surface)] text-[var(--error)]"
              }`}
            >
              {notice.message}
            </p>
          ) : null}

          {mode === "login" ? <LoginForm /> : null}
          {mode === "signup" ? <SignupForm /> : null}
          {mode === "forgot-password" ? <ForgotPasswordForm /> : null}
          {mode === "reset-password" ? <ResetPasswordForm /> : null}

          {mode === "login" ? (
            <p className="mt-6 text-center text-[14px]">
              <Link
                href="/forgot-password"
                className="auth-link font-semibold text-[var(--text-sub)]"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </p>
          ) : null}

          <p
            className={`${
              mode === "login" ? "mt-3" : "mt-6"
            } text-center text-[14px] text-[var(--text-sub)]`}
          >
            {copy.footerText}{" "}
            <Link
              href={copy.footerHref}
              className="auth-link font-bold text-[var(--accent)]"
            >
              {copy.footerLinkLabel}
            </Link>
          </p>

          {mode === "signup" ? (
            <p className="mt-3 text-center text-[12px]">
              <Link
                href="/privacy"
                className="privacy-link font-medium text-[var(--text-muted)]"
              >
                개인정보 처리방침
              </Link>
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
