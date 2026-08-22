import type { Bookmark } from "./types";
import { ArrowUpRightIcon, MoreIcon } from "./icons";
import { LinkPreview } from "./link-preview";

type LinkCardProps = {
  bookmark: Bookmark;
};

const iconClassByPreview: Record<Bookmark["preview"], string> = {
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

export function LinkCard({ bookmark }: LinkCardProps) {
  return (
    <article className="link-card group overflow-hidden rounded-2xl bg-[var(--surface)] shadow-[var(--shadow-card)]">
      <div className="h-[166px] overflow-hidden sm:h-[184px]">
        <div className="preview-art h-full">
          <LinkPreview variant={bookmark.preview} />
        </div>
      </div>

      <div className="p-5 sm:p-[22px]">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[15px] font-black shadow-sm ${iconClassByPreview[bookmark.preview]}`}
            aria-hidden="true"
          >
            {bookmark.icon}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[16px] font-bold tracking-[-0.02em] text-[var(--text)]">{bookmark.title}</h2>
            <p className="mt-0.5 truncate text-[12px] text-[var(--text-muted)]">{bookmark.domain}</p>
          </div>
          <button
            type="button"
            className="icon-button -mr-1 rounded-lg p-1.5 text-[var(--text-muted)]"
            aria-label={`${bookmark.title} 더보기`}
          >
            <MoreIcon className="h-[18px] w-[18px]" />
          </button>
        </div>

        <p className="mt-4 line-clamp-2 min-h-11 text-[13px] leading-[1.7] text-[var(--text-sub)]">{bookmark.description}</p>

        <div className="mt-5 flex items-center border-t border-[var(--border)] pt-4">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-sub)]">
            <span className={`h-2 w-2 rounded-full ${folderDotClass[bookmark.folderId] ?? "bg-[var(--text-muted)]"}`} />
            {bookmark.folder}
          </span>
          <a
            href={`https://${bookmark.domain}`}
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
