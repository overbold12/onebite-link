"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ChevronDownIcon, LinkIcon } from "./icons";
import type { Folder, OpenGraphData } from "./types";

type NewLinkFormProps = {
  folders: Folder[];
};

export function NewLinkForm({ folders }: NewLinkFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const submitLockRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitLockRef.current) return;

    submitLockRef.current = true;
    setError("");
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const inputUrl = String(formData.get("url") ?? "").trim();
    const normalizedUrl = /^https?:\/\//i.test(inputUrl) ? inputUrl : `https://${inputUrl}`;
    const folderId = String(formData.get("folder") ?? "");
    const folder = folders.find((item) => item.id === folderId);

    if (!folder) {
      setError("저장할 폴더를 선택해 주세요.");
      submitLockRef.current = false;
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/open-graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl }),
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : "링크 정보를 불러오지 못했어요.";
        throw new Error(message);
      }

      const openGraph = payload as OpenGraphData;

      const { error: insertError } = await supabase
        .from("links")
        .insert({
          url: openGraph.url,
          title: openGraph.title,
          description: openGraph.description,
          thumbnail_url: openGraph.thumbnail,
          folder_id: folder.id,
        })
        .select("id")
        .single();

      if (insertError) {
        throw new Error("링크를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
      }

      router.push("/");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "링크를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
      submitLockRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 max-w-[680px] rounded-2xl bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-8"
    >
      <div>
        <label htmlFor="url" className="text-[14px] font-bold text-[var(--text)]">
          링크
        </label>
        <div className="mt-2.5 flex h-[54px] items-center gap-3 rounded-xl bg-[var(--surface-subtle)] px-4 text-[var(--text-muted)] focus-within:bg-[var(--surface)] focus-within:ring-3 focus-within:ring-[var(--focus)]">
          <LinkIcon className="h-5 w-5 shrink-0" />
          <input
            id="url"
            name="url"
            type="text"
            inputMode="url"
            required
            autoFocus
            autoComplete="url"
            disabled={isSaving}
            aria-invalid={error ? "true" : undefined}
            placeholder="https://example.com"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--text)] outline-none placeholder:text-[var(--text-placeholder)]"
          />
        </div>
        <p className="mt-2 text-[12px] leading-5 text-[var(--text-muted)]">저장하고 싶은 페이지의 주소를 입력해 주세요.</p>
      </div>

      <div className="mt-7">
        <label htmlFor="folder" className="text-[14px] font-bold text-[var(--text)]">
          폴더
        </label>
        <div className="relative mt-2.5">
          <select
            id="folder"
            name="folder"
            required
            defaultValue=""
            disabled={isSaving}
            className="h-[54px] w-full appearance-none rounded-xl border-0 bg-[var(--surface-subtle)] px-4 pr-11 text-[15px] text-[var(--text)] outline-none focus:bg-[var(--surface)] focus:ring-3 focus:ring-[var(--focus)]"
          >
            <option value="" disabled>폴더를 선택해 주세요</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>{folder.name}</option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
        </div>
      </div>

      <p
        aria-live="polite"
        className={`mt-5 min-h-5 text-[13px] ${error ? "text-[var(--error)]" : "text-[var(--text-sub)]"}`}
      >
        {error || (isSaving ? "페이지 정보를 확인하고 있어요…" : "")}
      </p>

      <div className="mt-4 flex justify-end border-t border-[var(--border)] pt-6">
        <button
          type="submit"
          disabled={isSaving}
          className="primary-button flex h-12 w-full items-center justify-center rounded-xl bg-[var(--accent)] px-7 text-[15px] font-bold text-white shadow-[var(--shadow-button)] sm:w-auto"
        >
          {isSaving ? "저장 중…" : "확인"}
        </button>
      </div>
    </form>
  );
}
