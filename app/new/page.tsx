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
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8c82df]">Add bookmark</p>
        <h1 id="new-link-title" className="mt-1.5 text-[26px] font-extrabold tracking-[-0.045em] text-[#1d1c22] sm:text-[30px]">
          새 링크 추가
        </h1>
        <p className="mt-2 text-[13px] text-[#918e98]">기억해 두고 싶은 링크를 나만의 폴더에 저장하세요.</p>
        <NewLinkForm folders={folders} />
      </section>
    </AppShell>
  );
}
