"use client";

import type { AuthError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type ErrorToast = {
  id: number;
  message: string;
};

function getUpdatePasswordErrorMessage(error: AuthError) {
  switch (error.code) {
    case "weak_password":
      return "더 안전한 비밀번호를 입력해 주세요.";
    case "same_password":
      return "기존 비밀번호와 다른 비밀번호를 입력해 주세요.";
    case "session_not_found":
    case "bad_jwt":
      return "재설정 링크가 만료되었습니다. 새 링크를 요청해 주세요.";
    case "over_request_rate_limit":
      return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    case "request_timeout":
      return "요청 시간이 초과되었습니다. 다시 시도해 주세요.";
    default:
      return "비밀번호를 변경하지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }
}

export function ResetPasswordForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ErrorToast | null>(null);

  const isFormComplete = password.length > 0 && passwordConfirm.length > 0;

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
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        showError(getUpdatePasswordErrorMessage(error));
        return;
      }

      await supabase.auth.signOut({ scope: "local" });
      router.replace("/login?password_updated=1");
      router.refresh();
    } catch {
      showError("비밀번호를 변경하지 못했습니다. 네트워크 연결을 확인해 주세요.");
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
            htmlFor="new-password"
            className="block text-[14px] font-semibold text-[var(--text)]"
          >
            새 비밀번호
          </label>
          <input
            id="new-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="새 비밀번호를 입력해 주세요"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="auth-input mt-2 block h-[54px] w-full rounded-xl border-0 bg-[var(--background)] px-4 text-[17px] text-[var(--text)] outline-none placeholder:text-[var(--text-placeholder)]"
          />
        </div>

        <div>
          <label
            htmlFor="new-password-confirm"
            className="block text-[14px] font-semibold text-[var(--text)]"
          >
            새 비밀번호 확인
          </label>
          <input
            id="new-password-confirm"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            placeholder="새 비밀번호를 한 번 더 입력해 주세요"
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
          {isSubmitting ? "변경 중..." : "새 비밀번호로 변경"}
        </button>
      </form>
    </>
  );
}
