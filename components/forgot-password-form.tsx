"use client";

import type { AuthError } from "@supabase/supabase-js";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type ErrorToast = {
  id: number;
  message: string;
};

function getResetEmailErrorMessage(error: AuthError) {
  switch (error.code) {
    case "email_address_invalid":
    case "validation_failed":
      return "올바른 이메일 주소를 입력해 주세요.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    case "request_timeout":
      return "요청 시간이 초과되었습니다. 다시 시도해 주세요.";
    default:
      return "리셋 링크를 발송하지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }
}

export function ForgotPasswordForm() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [toast, setToast] = useState<ErrorToast | null>(null);

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

    if (!email.trim() || isSubmitting) return;

    setToast(null);
    setIsSubmitting(true);

    try {
      const redirectTo = new URL("/auth/callback", window.location.origin).toString();
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (error) {
        showError(getResetEmailErrorMessage(error));
        return;
      }

      setIsSent(true);
    } catch {
      showError("리셋 링크를 발송하지 못했습니다. 네트워크 연결을 확인해 주세요.");
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
            htmlFor="reset-email"
            className="block text-[14px] font-semibold text-[var(--text)]"
          >
            이메일
          </label>
          <input
            id="reset-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setIsSent(false);
            }}
            className="auth-input mt-2 block h-[54px] w-full rounded-xl border-0 bg-[var(--background)] px-4 text-[17px] text-[var(--text)] outline-none placeholder:text-[var(--text-placeholder)]"
          />
        </div>

        {isSent ? (
          <p
            role="status"
            aria-live="polite"
            className="rounded-xl bg-[var(--success-surface)] px-4 py-3 text-center text-[13px] font-semibold leading-5 text-[var(--success)]"
          >
            입력한 이메일로 리셋 링크를 보냈어요. 메일함과 스팸함을 확인해 주세요.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!email.trim() || isSubmitting}
          className="primary-button mt-2 h-[54px] w-full rounded-xl bg-[var(--accent)] px-5 text-[17px] font-bold text-white shadow-[var(--shadow-button)]"
        >
          {isSubmitting
            ? "발송 중..."
            : isSent
              ? "리셋 링크 다시 보내기"
              : "비밀번호 리셋 링크 발송"}
        </button>
      </form>
    </>
  );
}
