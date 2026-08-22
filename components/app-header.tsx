import Link from "next/link";
import { LinkIcon, PlusIcon } from "./icons";

export function AppHeader() {
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

        <Link
          href="/new"
          className="primary-button flex h-11 items-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 text-[14px] font-bold text-white shadow-[var(--shadow-button)] sm:px-[18px]"
        >
          <PlusIcon className="h-[18px] w-[18px]" />
          새 링크
        </Link>
      </div>
    </header>
  );
}
