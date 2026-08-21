import Link from "next/link";
import { PlusIcon } from "./icons";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e8e8ee] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] w-full max-w-[1600px] items-center justify-between px-5 sm:px-7 lg:px-10">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="한입 링크 홈">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#6c5ce7] shadow-[0_6px_18px_rgba(108,92,231,0.25)] transition-transform group-hover:-rotate-3">
            <span className="h-[15px] w-[11px] rounded-[2px] bg-white after:absolute after:bottom-[10px] after:left-1/2 after:h-[6px] after:w-[6px] after:-translate-x-1/2 after:rotate-45 after:bg-[#6c5ce7]" />
          </span>
          <span className="text-[20px] font-extrabold tracking-[-0.045em] text-[#1c1b21]">
            한입 링크
          </span>
        </Link>

        <Link
          href="/new"
          className="flex h-11 items-center gap-1.5 rounded-xl bg-[#6c5ce7] px-4 text-[14px] font-bold text-white shadow-[0_7px_18px_rgba(108,92,231,0.22)] transition hover:-translate-y-0.5 hover:bg-[#5e4fd5] sm:px-[18px]"
        >
          <PlusIcon className="h-[18px] w-[18px]" />
          새 링크
        </Link>
      </div>
    </header>
  );
}
