import Link from "next/link";
import { FolderIcon, LinkIcon, PlusIcon } from "./icons";

type AppHeaderProps = {
  onNewFolder: () => void;
};

export function AppHeader({ onNewFolder }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--header-background)] backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-7 lg:px-10">
        <Link href="/" className="brand-link flex items-center gap-2.5" aria-label="한입 링크 홈">
          <span className="brand-mark flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-[var(--shadow-button)]">
            <LinkIcon className="h-[19px] w-[19px]" />
          </span>
          <span className="text-[19px] font-extrabold tracking-[-0.04em] text-[var(--text)]">
            한입 링크
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewFolder}
            aria-label="새 폴더"
            className="secondary-button flex h-11 items-center gap-1.5 rounded-xl bg-[var(--surface-accent)] px-3 text-[14px] font-bold text-[var(--accent-hover)] sm:px-4"
          >
            <FolderIcon className="h-[18px] w-[18px]" />
            <span className="hidden sm:inline">새 폴더</span>
          </button>
          <Link
            href="/new"
            aria-label="새 링크"
            className="primary-button flex h-11 items-center gap-1.5 rounded-xl bg-[var(--accent)] px-3 text-[14px] font-bold text-white shadow-[var(--shadow-button)] sm:px-[18px]"
          >
            <PlusIcon className="h-[18px] w-[18px]" />
            <span className="hidden min-[420px]:inline">새 링크</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
