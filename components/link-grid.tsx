"use client";

import { useState } from "react";
import {
  deleteBookmark,
  useDeletedBookmarks,
  useStoredBookmarks,
} from "@/hooks/use-bookmarks";
import type { Bookmark } from "./types";
import { SearchIcon } from "./icons";
import { DeleteLinkModal } from "./delete-link-modal";
import { LinkCard } from "./link-card";

type LinkGridProps = {
  bookmarks: Bookmark[];
  title?: string;
  eyebrow?: string;
  description?: string;
  folderId?: string;
};

export function LinkGrid({
  bookmarks,
  title = "모든 링크",
  eyebrow = "My collection",
  description = "저장해 둔 링크를 한눈에 확인해 보세요.",
  folderId,
}: LinkGridProps) {
  const [bookmarkToDelete, setBookmarkToDelete] = useState<Bookmark | null>(null);
  const storedBookmarks = useStoredBookmarks();
  const deletedBookmarks = useDeletedBookmarks();
  const deletedBookmarkIds = new Set(deletedBookmarks.map((bookmark) => bookmark.id));
  const visibleStoredBookmarks = folderId
    ? storedBookmarks.filter((bookmark) => bookmark.folderId === folderId)
    : storedBookmarks;
  const visibleInitialBookmarks = bookmarks.filter(
    (bookmark) => !deletedBookmarkIds.has(bookmark.id),
  );
  const allBookmarks = [...visibleStoredBookmarks, ...visibleInitialBookmarks];

  const handleConfirmDelete = (bookmark: Bookmark) => {
    deleteBookmark(bookmark);
    setBookmarkToDelete(null);
  };

  return (
    <section aria-labelledby="links-title">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex rounded-lg bg-[var(--surface-accent)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--accent-hover)]">{eyebrow}</p>
          <div className="mt-3 flex items-center gap-2.5">
            <h1 id="links-title" className="text-[28px] font-extrabold tracking-[-0.04em] text-[var(--text)] sm:text-[32px]">
              {title}
            </h1>
            <span className="flex h-6 min-w-6 items-center justify-center rounded-lg bg-[var(--surface)] px-1.5 text-[12px] font-bold text-[var(--text-muted)] shadow-[var(--shadow-card)]">{allBookmarks.length}</span>
          </div>
          <p className="mt-2 text-[14px] leading-6 text-[var(--text-sub)]">{description}</p>
        </div>

        <label className="flex h-12 w-full items-center gap-2.5 rounded-xl bg-[var(--surface)] px-4 text-[var(--text-muted)] shadow-[var(--shadow-card)] focus-within:ring-3 focus-within:ring-[var(--focus)] sm:w-[252px]">
          <SearchIcon className="h-[18px] w-[18px] shrink-0" />
          <span className="sr-only">링크 검색</span>
          <input
            type="search"
            placeholder="링크 검색"
            className="min-w-0 flex-1 bg-transparent text-[14px] text-[var(--text)] outline-none placeholder:text-[var(--text-placeholder)]"
          />
        </label>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xl:gap-6">
        {allBookmarks.map((bookmark) => (
          <LinkCard
            key={bookmark.id}
            bookmark={bookmark}
            onDelete={setBookmarkToDelete}
          />
        ))}
      </div>
      <DeleteLinkModal
        bookmark={bookmarkToDelete}
        onClose={() => setBookmarkToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
