"use client";

import type { AuthError } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type ErrorToast = {
  id: number;
  message: string;
};

function getLoginErrorMessage(error: AuthError) {
  switch (error.code) {
    case "invalid_credentials":
    case "user_not_found":
      return "이메일 또는 비밀번호가 올바르지 않습니다.";
    case "email_not_confirmed":
      return "이메일 인증을 완료한 뒤 로그인해 주세요.";
    case "email_address_invalid":
    case "validation_failed":
      return "올바른 이메일 주소를 입력해 주세요.";
    case "user_banned":
      return "사용이 제한된 계정입니다.";
    case "provider_disabled":
    case "email_provider_disabled":
      return "현재 이메일 로그인을 사용할 수 없습니다.";
    case "over_request_rate_limit":
      return "로그인 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    case "request_timeout":
      return "요청 시간이 초과되었습니다. 다시 시도해 주세요.";
    default:
      return "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.";
  }
}

function getKakaoLoginErrorMessage(error: AuthError) {
  if (error.code === "provider_disabled") {
    return "현재 카카오 로그인을 사용할 수 없습니다.";
  }

  return getLoginErrorMessage(error);
}

export function LoginForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isKakaoSubmitting, setIsKakaoSubmitting] = useState(false);
  const [toast, setToast] = useState<ErrorToast | null>(null);

  const isFormComplete = email.trim().length > 0 && password.length > 0;

  useEffect(() => {
    if (!toast) return;

    const timeoutId = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const showError = (message: string) => {
    setToast({ id: Date.now(), message });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormComplete || isSubmitting || isKakaoSubmitting) return;

    setToast(null);
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        showError(getLoginErrorMessage(error));
        return;
      }

      if (!data.user || !data.session) {
        showError("로그인을 완료하지 못했습니다. 다시 시도해 주세요.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      showError("로그인에 실패했습니다. 네트워크 연결을 확인해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKakaoLogin = async () => {
    if (isSubmitting || isKakaoSubmitting) return;

    setToast(null);
    setIsKakaoSubmitting(true);

    try {
      const callbackUrl = new URL(
        "/auth/callback?next=/",
        window.location.origin,
      ).toString();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: callbackUrl,
        },
      });

      if (error) {
        showError(getKakaoLoginErrorMessage(error));
      }
    } catch {
      showError(
        "카카오 로그인을 시작하지 못했습니다. 네트워크 연결을 확인해 주세요.",
      );
    } finally {
      setIsKakaoSubmitting(false);
    }
  };

  return (
    <>
      {toast ? (
        <div
          key={toast.id}
          role="alert"
          aria-live="assertive"
          className="auth-toast pointer-events-none fixed left-1/2 top-5 z-[100] w-[calc(100%-40px)] max-w-[440px] -translate-x-1/2 rounded-2xl bg-[var(--error-surface)] px-5 py-4 text-center text-[14px] font-semibold leading-5 text-[var(--error)] shadow-[var(--shadow-modal)]"
        >
          {toast.message}
        </div>
      ) : null}

      <form className="mt-8" noValidate onSubmit={handleSubmit}>
        <div className="space-y-5">
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
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="auth-input mt-2 block h-[54px] w-full rounded-xl border-0 bg-[var(--background)] px-4 text-[17px] text-[var(--text)] outline-none placeholder:text-[var(--text-placeholder)]"
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <button
            type="submit"
            disabled={!isFormComplete || isSubmitting || isKakaoSubmitting}
            className="primary-button h-[54px] w-full rounded-xl bg-[var(--accent)] px-5 text-[17px] font-bold text-white shadow-[var(--shadow-button)]"
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>

          <button
            type="button"
            aria-label={
              isKakaoSubmitting
                ? "카카오 로그인 화면으로 이동 중"
                : "카카오 로그인"
            }
            disabled={isSubmitting || isKakaoSubmitting}
            onClick={handleKakaoLogin}
            className="kakao-login-button block w-full overflow-hidden rounded-xl"
          >
            <Image
              src="/kakao_login_large_wide.png"
              alt=""
              width={600}
              height={90}
              className="h-auto w-full"
            />
          </button>
        </div>
      </form>
    </>
  );
}
