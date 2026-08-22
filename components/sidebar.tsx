import Link from "next/link";
import type { Folder } from "./types";
import { FolderIcon, GridIcon, PlusIcon } from "./icons";

type SidebarProps = {
  folders: Folder[];
  totalCount: number;
  activeFolderId?: string | null;
};

const folderColorClass: Record<string, string> = {
  design: "text-[var(--folder-design)]",
  development: "text-[var(--folder-development)]",
  articles: "text-[var(--folder-articles)]",
  inspiration: "text-[var(--folder-inspiration)]",
};

export function Sidebar({ folders, totalCount, activeFolderId }: SidebarProps) {
  return (
    <aside className="relative w-full shrink-0 border-b border-[var(--border)] bg-[var(--surface)] px-5 py-4 md:sticky md:top-[68px] md:h-[calc(100vh-68px)] md:w-[232px] md:self-start md:border-b-0 md:border-r md:px-4 md:py-7 lg:w-[248px] lg:px-5">
      <nav aria-label="링크 폴더" className="mx-auto max-w-2xl md:mx-0">
        <Link
          href="/"
          className={`nav-item flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[14px] font-semibold ${
            activeFolderId === null
              ? "nav-item-active bg-[var(--surface-accent)] text-[var(--accent-hover)]"
              : "text-[var(--text-sub)]"
          }`}
          aria-current={activeFolderId === null ? "page" : undefined}
        >
          <GridIcon className="h-5 w-5" />
          <span>All</span>
          <span className="ml-auto rounded-lg bg-[var(--surface)] px-2 py-0.5 text-[11px] font-bold text-[var(--text-muted)] shadow-[var(--shadow-count)]">
            {totalCount}
          </span>
        </Link>

        <div className="mt-5 flex items-center justify-between px-2 md:mt-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">Folders</p>
          <button
            type="button"
            className="icon-button rounded-lg p-1.5 text-[var(--text-muted)]"
            aria-label="새 폴더 만들기"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mobile-folder-list mt-2 flex gap-2 overflow-x-auto pb-1 md:block md:space-y-1 md:overflow-visible md:pb-0">
          {folders.map((folder) => (
            <Link
              key={folder.id}
              href={`/folder/${folder.id}`}
              className={`nav-item flex h-11 shrink-0 items-center gap-2.5 rounded-xl px-3 text-[14px] font-medium md:w-full ${
                activeFolderId === folder.id
                  ? "nav-item-active bg-[var(--surface-accent)] font-bold text-[var(--accent-hover)]"
                  : "text-[var(--text-sub)]"
              }`}
              aria-current={activeFolderId === folder.id ? "page" : undefined}
            >
              <FolderIcon className={`h-[18px] w-[18px] ${folderColorClass[folder.id] ?? "text-[var(--text-muted)]"}`} />
              <span>{folder.name}</span>
              <span className="ml-1 text-[11px] text-[var(--text-muted)] md:ml-auto">{folder.count}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="absolute bottom-6 left-5 right-5 hidden overflow-hidden rounded-2xl bg-[var(--surface-accent)] p-4 md:block">
        <span className="absolute -right-5 -top-7 h-20 w-20 rounded-full bg-[var(--surface-accent-strong)]" />
        <span className="relative flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--surface)] text-[var(--accent)] shadow-sm">
          <PlusIcon className="h-4 w-4" />
        </span>
        <p className="relative mt-3 text-[12px] font-bold text-[var(--text)]">기억하고 싶은 순간</p>
        <p className="relative mt-1 text-[11px] leading-4 text-[var(--text-sub)]">좋은 페이지를 발견하면<br />한입에 저장해 보세요.</p>
      </div>
    </aside>
  );
}
