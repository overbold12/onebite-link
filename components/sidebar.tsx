import Link from "next/link";
import type { Folder } from "./types";
import { FolderIcon, GridIcon, PlusIcon } from "./icons";

type SidebarProps = {
  folders: Folder[];
  totalCount: number;
  activeFolderId?: string | null;
};

export function Sidebar({ folders, totalCount, activeFolderId }: SidebarProps) {
  return (
    <aside className="relative w-full shrink-0 border-b border-[#e8e8ee] bg-white px-5 py-5 md:sticky md:top-[76px] md:h-[calc(100vh-76px)] md:w-[240px] md:self-start md:border-b-0 md:border-r md:px-4 md:py-7 lg:w-[260px] lg:px-5">
      <nav aria-label="링크 폴더" className="mx-auto max-w-xl md:mx-0">
        <Link
          href="/"
          className={`flex h-12 w-full items-center gap-3 rounded-xl px-3.5 text-left text-[14px] font-bold transition ${
            activeFolderId === null
              ? "bg-[#f0eefe] text-[#5f50d8]"
              : "text-[#5f5d67] hover:bg-[#f7f7fa]"
          }`}
          aria-current={activeFolderId === null ? "page" : undefined}
        >
          <GridIcon className="h-5 w-5" />
          <span>All</span>
          <span className="ml-auto rounded-md bg-white/75 px-2 py-0.5 text-xs font-semibold text-[#7b70d7]">
            {totalCount}
          </span>
        </Link>

        <div className="mt-6 flex items-center justify-between px-2 md:mt-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#aaa8b2]">Folders</p>
          <button
            type="button"
            className="rounded-md p-1 text-[#a5a3ad] transition hover:bg-[#f3f3f6] hover:text-[#67646f]"
            aria-label="새 폴더 만들기"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 md:block md:space-y-1 md:overflow-visible md:pb-0">
          {folders.map((folder) => (
            <Link
              key={folder.id}
              href={`/folder/${folder.id}`}
              className={`flex h-11 shrink-0 items-center gap-2.5 rounded-xl px-3 text-[14px] font-medium transition md:w-full ${
                activeFolderId === folder.id
                  ? "bg-[#f0eefe] font-bold text-[#5f50d8]"
                  : "text-[#5f5d67] hover:bg-[#f7f7fa]"
              }`}
              aria-current={activeFolderId === folder.id ? "page" : undefined}
            >
              <FolderIcon className="h-[18px] w-[18px]" style={{ color: folder.color }} />
              <span>{folder.name}</span>
              <span className="ml-1 text-xs text-[#b3b1ba] md:ml-auto">{folder.count}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="absolute bottom-7 left-5 right-5 hidden rounded-2xl bg-[#f7f7fa] p-4 md:block">
        <p className="text-[12px] font-semibold text-[#77747f]">링크를 더 간편하게</p>
        <p className="mt-1 text-[11px] leading-4 text-[#aaa8b2]">자주 찾는 페이지를 한입에 저장하세요.</p>
      </div>
    </aside>
  );
}
