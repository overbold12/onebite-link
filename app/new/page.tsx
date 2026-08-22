import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { NewLinkForm } from "@/components/new-link-form";
import { bookmarks, folders } from "@/data/bookmarks";

export const metadata: Metadata = {
  title: "새 링크 | 한입 링크",
  description: "새로운 링크를 폴더에 저장하세요.",
};

export default function NewLinkPage() {
  return (
    <AppShell folders={folders} totalCount={bookmarks.length}>
      <section aria-labelledby="new-link-title">
        <p className="inline-flex rounded-lg bg-[var(--surface-accent)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--accent-hover)]">Add bookmark</p>
        <h1 id="new-link-title" className="mt-3 text-[28px] font-extrabold tracking-[-0.04em] text-[var(--text)] sm:text-[32px]">
          새 링크 추가
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-[var(--text-sub)]">기억해 두고 싶은 링크를 나만의 폴더에 저장하세요.</p>
        <NewLinkForm folders={folders} />
      </section>
    </AppShell>
  );
}
