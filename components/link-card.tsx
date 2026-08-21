import type { Bookmark } from "./types";
import { ArrowUpRightIcon, MoreIcon } from "./icons";
import { LinkPreview } from "./link-preview";

type LinkCardProps = {
  bookmark: Bookmark;
};

export function LinkCard({ bookmark }: LinkCardProps) {
  return (
    <article className="group overflow-hidden rounded-[20px] border border-[#e7e7ed] bg-white shadow-[0_3px_12px_rgba(20,20,35,0.025)] transition duration-300 hover:-translate-y-1 hover:border-[#dcd9ef] hover:shadow-[0_16px_36px_rgba(36,31,71,0.09)]">
      <div className="h-[158px] overflow-hidden border-b border-[#eeeeF2] sm:h-[176px]">
        <LinkPreview variant={bookmark.preview} />
      </div>

      <div className="p-5">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[16px] font-black shadow-sm ${bookmark.preview === "notion" ? "border border-[#dfdfe3] text-black" : "text-white"}`}
            style={{ backgroundColor: bookmark.iconColor }}
            aria-hidden="true"
          >
            {bookmark.icon}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[16px] font-bold tracking-[-0.02em] text-[#242329]">{bookmark.title}</h2>
            <p className="mt-0.5 truncate text-[12px] text-[#a09da7]">{bookmark.domain}</p>
          </div>
          <button
            type="button"
            className="-mr-1 rounded-lg p-1.5 text-[#aaa8b1] transition hover:bg-[#f3f3f6] hover:text-[#5d5a64]"
            aria-label={`${bookmark.title} 더보기`}
          >
            <MoreIcon className="h-[18px] w-[18px]" />
          </button>
        </div>

        <p className="mt-4 line-clamp-2 min-h-10 text-[13px] leading-5 text-[#77747e]">{bookmark.description}</p>

        <div className="mt-5 flex items-center border-t border-[#f0f0f3] pt-4">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#7c7983]">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: bookmark.folderColor }} />
            {bookmark.folder}
          </span>
          <a
            href={`https://${bookmark.domain}`}
            target="_blank"
            rel="noreferrer"
            className="ml-auto flex items-center gap-1 text-[12px] font-semibold text-[#8a8791] transition hover:text-[#6152da]"
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
