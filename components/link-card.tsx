"use client";

import { useState } from "react";
import type { Bookmark } from "./types";
import type { PreviewStyle } from "./types";
import { ArrowUpRightIcon, PencilIcon, TrashIcon } from "./icons";
import { LinkPreview } from "./link-preview";

type LinkCardProps = {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
};

const iconClassByPreview: Record<PreviewStyle, string> = {
  figma: "bg-[var(--figma-red)] text-white",
  github: "bg-[var(--text)] text-white",
  notion: "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)]",
  dribbble: "bg-[var(--dribbble-pink)] text-white",
  vercel: "bg-[var(--text)] text-white",
  medium: "bg-[var(--text)] text-white",
};

const folderDotClass: Record<string, string> = {
  design: "bg-[var(--folder-design)]",
  development: "bg-[var(--folder-development)]",
  articles: "bg-[var(--folder-articles)]",
  inspiration: "bg-[var(--folder-inspiration)]",
};

export function LinkCard({ bookmark, onEdit, onDelete }: LinkCardProps) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const showThumbnail = bookmark.thumbnail && !thumbnailFailed;

  return (
    <article className="link-card group relative overflow-hidden rounded-2xl bg-[var(--surface)] shadow-[var(--shadow-card)]">
      <div className="link-card-actions absolute right-3 top-3 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(bookmark)}
          className="link-edit-button flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--accent)] shadow-[var(--shadow-card)]"
          aria-label={`${bookmark.title} 링크 수정`}
          title="링크 수정"
        >
          <PencilIcon className="h-[19px] w-[19px]" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(bookmark)}
          className="link-delete-button flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--error)] shadow-[var(--shadow-card)]"
          aria-label={`${bookmark.title} 링크 삭제`}
          title="링크 삭제"
        >
          <TrashIcon className="h-[19px] w-[19px]" />
        </button>
      </div>

      <div className="h-[166px] overflow-hidden sm:h-[184px]">
        <div className="preview-art h-full">
          {showThumbnail ? (
            // OG images can come from any public host, so they cannot use a fixed next/image allowlist.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={bookmark.thumbnail ?? undefined}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setThumbnailFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <LinkPreview variant={bookmark.preview ?? "medium"} />
          )}
        </div>
      </div>

      <div className="p-5 sm:p-[22px]">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[15px] font-black shadow-sm ${
              bookmark.preview
                ? iconClassByPreview[bookmark.preview]
                : "bg-[var(--accent)] text-white"
            }`}
            aria-hidden="true"
          >
            {bookmark.icon}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[16px] font-bold tracking-[-0.02em] text-[var(--text)]">{bookmark.title}</h2>
            <p className="mt-0.5 truncate text-[12px] text-[var(--text-muted)]">{bookmark.domain}</p>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 min-h-11 text-[13px] leading-[1.7] text-[var(--text-sub)]">{bookmark.description}</p>

        <div className="mt-5 flex items-center border-t border-[var(--border)] pt-4">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-sub)]">
            <span className={`h-2 w-2 rounded-full ${folderDotClass[bookmark.folderId] ?? "bg-[var(--text-muted)]"}`} />
            {bookmark.folder}
          </span>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noreferrer"
            className="visit-link ml-auto flex items-center gap-1 text-[12px] font-bold text-[var(--accent)]"
            aria-label={`${bookmark.title} 새 창에서 열기`}
          >
            방문하기
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
