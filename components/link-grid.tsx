import type { Bookmark } from "./types";
import { SearchIcon } from "./icons";
import { LinkCard } from "./link-card";

type LinkGridProps = {
  bookmarks: Bookmark[];
  title?: string;
  eyebrow?: string;
  description?: string;
};

export function LinkGrid({
  bookmarks,
  title = "모든 링크",
  eyebrow = "My collection",
  description = "저장해 둔 링크를 한눈에 확인해 보세요.",
}: LinkGridProps) {
  return (
    <section aria-labelledby="links-title">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8c82df]">{eyebrow}</p>
          <div className="mt-1.5 flex items-baseline gap-2.5">
            <h1 id="links-title" className="text-[26px] font-extrabold tracking-[-0.045em] text-[#1d1c22] sm:text-[30px]">
              {title}
            </h1>
            <span className="text-[13px] font-semibold text-[#aaa7b1]">{bookmarks.length}</span>
          </div>
          <p className="mt-2 text-[13px] text-[#918e98]">{description}</p>
        </div>

        <label className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-[#e4e4e9] bg-white px-3.5 text-[#9e9ba5] shadow-sm transition focus-within:border-[#bcb5ee] focus-within:ring-3 focus-within:ring-[#6c5ce7]/10 sm:w-[230px]">
          <SearchIcon className="h-[18px] w-[18px] shrink-0" />
          <span className="sr-only">링크 검색</span>
          <input
            type="search"
            placeholder="링크 검색"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-[#39373e] outline-none placeholder:text-[#aaa8b1]"
          />
        </label>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:gap-6">
        {bookmarks.map((bookmark) => (
          <LinkCard key={bookmark.domain} bookmark={bookmark} />
        ))}
      </div>
    </section>
  );
}
