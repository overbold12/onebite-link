import Link from "next/link";
import { LinkIcon } from "./icons";
import { SignupForm } from "./signup-form";

type AuthPageProps = {
  mode: "login" | "signup";
};

const authCopy = {
  login: {
    title: "다시 만나서 반가워요",
    description: "저장해 둔 링크를 이어서 관리해 보세요.",
    buttonLabel: "로그인",
    footerText: "아직 계정이 없나요?",
    footerLinkLabel: "회원가입",
    footerHref: "/signup",
  },
  signup: {
    title: "한입 링크 시작하기",
    description: "흩어진 링크를 한곳에 모아 간편하게 관리하세요.",
    buttonLabel: "회원가입",
    footerText: "이미 계정이 있나요?",
    footerLinkLabel: "로그인",
    footerHref: "/login",
  },
} as const;

export function AuthPage({ mode }: AuthPageProps) {
  const copy = authCopy[mode];
  const isSignup = mode === "signup";

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

          {isSignup ? (
            <SignupForm />
          ) : (
            <form className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-[14px] font-semibold text-[var(--text)]"
                >
                  이메일
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  className="auth-input mt-2 block h-[54px] w-full rounded-xl border-0 bg-[var(--background)] px-4 text-[17px] text-[var(--text)] outline-none placeholder:text-[var(--text-placeholder)]"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-[14px] font-semibold text-[var(--text)]"
                >
                  비밀번호
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="비밀번호를 입력해 주세요"
                  className="auth-input mt-2 block h-[54px] w-full rounded-xl border-0 bg-[var(--background)] px-4 text-[17px] text-[var(--text)] outline-none placeholder:text-[var(--text-placeholder)]"
                />
              </div>

              <button
                type="button"
                className="primary-button mt-2 h-[54px] w-full rounded-xl bg-[var(--accent)] px-5 text-[17px] font-bold text-white shadow-[var(--shadow-button)]"
              >
                {copy.buttonLabel}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-[14px] text-[var(--text-sub)]">
            {copy.footerText}{" "}
            <Link
              href={copy.footerHref}
              className="auth-link font-bold text-[var(--accent)]"
            >
              {copy.footerLinkLabel}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
