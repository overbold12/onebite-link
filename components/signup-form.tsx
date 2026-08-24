"use client";

import type { AuthError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type ErrorToast = {
  id: number;
  message: string;
};

function getSignupErrorMessage(error: AuthError) {
  switch (error.code) {
    case "email_address_invalid":
    case "validation_failed":
      return "올바른 이메일 주소를 입력해 주세요.";
    case "email_address_not_authorized":
      return "이 이메일 주소로는 회원가입할 수 없습니다.";
    case "weak_password":
      return "비밀번호가 너무 짧거나 안전하지 않습니다.";
    case "email_exists":
    case "user_already_exists":
    case "identity_already_exists":
      return "이미 가입된 이메일입니다.";
    case "signup_disabled":
    case "provider_disabled":
    case "email_provider_disabled":
      return "현재 이메일 회원가입을 사용할 수 없습니다.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    case "request_timeout":
      return "요청 시간이 초과되었습니다. 다시 시도해 주세요.";
    default:
      return "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.";
  }
}

export function SignupForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ErrorToast | null>(null);

  const isFormComplete =
    email.trim().length > 0 &&
    password.length > 0 &&
    passwordConfirm.length > 0;

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

    if (!isFormComplete || isSubmitting) return;

    if (password !== passwordConfirm) {
      showError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setToast(null);
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        showError(getSignupErrorMessage(error));
        return;
      }

      if (!data.user) {
        showError("회원가입을 완료하지 못했습니다. 다시 시도해 주세요.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      showError("회원가입에 실패했습니다. 네트워크 연결을 확인해 주세요.");
    } finally {
      setIsSubmitting(false);
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

      <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="signup-email"
            className="block text-[14px] font-semibold text-[var(--text)]"
          >
            이메일
          </label>
          <input
            id="signup-email"
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
            htmlFor="signup-password"
            className="block text-[14px] font-semibold text-[var(--text)]"
          >
            비밀번호
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 입력해 주세요"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="auth-input mt-2 block h-[54px] w-full rounded-xl border-0 bg-[var(--background)] px-4 text-[17px] text-[var(--text)] outline-none placeholder:text-[var(--text-placeholder)]"
          />
        </div>

        <div>
          <label
            htmlFor="signup-password-confirm"
            className="block text-[14px] font-semibold text-[var(--text)]"
          >
            비밀번호 확인
          </label>
          <input
            id="signup-password-confirm"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 한 번 더 입력해 주세요"
            required
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            className="auth-input mt-2 block h-[54px] w-full rounded-xl border-0 bg-[var(--background)] px-4 text-[17px] text-[var(--text)] outline-none placeholder:text-[var(--text-placeholder)]"
          />
        </div>

        <button
          type="submit"
          disabled={!isFormComplete || isSubmitting}
          className="primary-button mt-2 h-[54px] w-full rounded-xl bg-[var(--accent)] px-5 text-[17px] font-bold text-white shadow-[var(--shadow-button)]"
        >
          {isSubmitting ? "가입 중..." : "회원가입"}
        </button>
      </form>
    </>
  );
}
