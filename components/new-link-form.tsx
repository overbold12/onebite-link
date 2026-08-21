import { ChevronDownIcon, LinkIcon } from "./icons";
import type { Folder } from "./types";

type NewLinkFormProps = {
  folders: Folder[];
};

export function NewLinkForm({ folders }: NewLinkFormProps) {
  return (
    <form className="mt-8 max-w-[680px] rounded-[22px] border border-[#e7e7ed] bg-white p-5 shadow-[0_8px_30px_rgba(36,31,71,0.045)] sm:p-8">
      <div>
        <label htmlFor="url" className="text-[13px] font-bold text-[#343139]">
          링크
        </label>
        <div className="mt-2.5 flex h-[52px] items-center gap-3 rounded-xl border border-[#dedde4] bg-white px-4 text-[#aaa7b1] transition focus-within:border-[#8e82e7] focus-within:ring-4 focus-within:ring-[#6c5ce7]/10">
          <LinkIcon className="h-5 w-5 shrink-0" />
          <input
            id="url"
            name="url"
            type="url"
            required
            autoFocus
            autoComplete="url"
            placeholder="https://example.com"
            className="min-w-0 flex-1 bg-transparent text-[14px] text-[#333139] outline-none placeholder:text-[#aaa7b1]"
          />
        </div>
        <p className="mt-2 text-[12px] leading-5 text-[#9a97a1]">저장하고 싶은 페이지의 주소를 입력해 주세요.</p>
      </div>

      <div className="mt-7">
        <label htmlFor="folder" className="text-[13px] font-bold text-[#343139]">
          폴더
        </label>
        <div className="relative mt-2.5">
          <select
            id="folder"
            name="folder"
            required
            defaultValue=""
            className="h-[52px] w-full appearance-none rounded-xl border border-[#dedde4] bg-white px-4 pr-11 text-[14px] text-[#4a474f] outline-none transition focus:border-[#8e82e7] focus:ring-4 focus:ring-[#6c5ce7]/10"
          >
            <option value="" disabled>폴더를 선택해 주세요</option>
            {folders.map((folder) => (
              <option key={folder.name} value={folder.name}>{folder.name}</option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#aaa7b1]" />
        </div>
      </div>

      <div className="mt-9 flex justify-end border-t border-[#f0f0f3] pt-6">
        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#6c5ce7] px-7 text-[14px] font-bold text-white shadow-[0_8px_20px_rgba(108,92,231,0.23)] transition hover:-translate-y-0.5 hover:bg-[#5e4fd5] sm:w-auto"
        >
          링크 저장하기
        </button>
      </div>
    </form>
  );
}
