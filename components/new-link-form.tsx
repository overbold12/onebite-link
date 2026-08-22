import { ChevronDownIcon, LinkIcon } from "./icons";
import type { Folder } from "./types";

type NewLinkFormProps = {
  folders: Folder[];
};

export function NewLinkForm({ folders }: NewLinkFormProps) {
  return (
    <form className="mt-8 max-w-[680px] rounded-2xl bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-8">
      <div>
        <label htmlFor="url" className="text-[14px] font-bold text-[var(--text)]">
          링크
        </label>
        <div className="mt-2.5 flex h-[54px] items-center gap-3 rounded-xl bg-[var(--surface-subtle)] px-4 text-[var(--text-muted)] focus-within:bg-[var(--surface)] focus-within:ring-3 focus-within:ring-[var(--focus)]">
          <LinkIcon className="h-5 w-5 shrink-0" />
          <input
            id="url"
            name="url"
            type="url"
            required
            autoFocus
            autoComplete="url"
            placeholder="https://example.com"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--text)] outline-none placeholder:text-[var(--text-placeholder)]"
          />
        </div>
        <p className="mt-2 text-[12px] leading-5 text-[var(--text-muted)]">저장하고 싶은 페이지의 주소를 입력해 주세요.</p>
      </div>

      <div className="mt-7">
        <label htmlFor="folder" className="text-[14px] font-bold text-[var(--text)]">
          폴더
        </label>
        <div className="relative mt-2.5">
          <select
            id="folder"
            name="folder"
            required
            defaultValue=""
            className="h-[54px] w-full appearance-none rounded-xl border-0 bg-[var(--surface-subtle)] px-4 pr-11 text-[15px] text-[var(--text)] outline-none focus:bg-[var(--surface)] focus:ring-3 focus:ring-[var(--focus)]"
          >
            <option value="" disabled>폴더를 선택해 주세요</option>
            {folders.map((folder) => (
              <option key={folder.name} value={folder.name}>{folder.name}</option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
        </div>
      </div>

      <div className="mt-9 flex justify-end border-t border-[var(--border)] pt-6">
        <button
          type="submit"
          className="primary-button flex h-12 w-full items-center justify-center rounded-xl bg-[var(--accent)] px-7 text-[15px] font-bold text-white shadow-[var(--shadow-button)] sm:w-auto"
        >
          링크 저장하기
        </button>
      </div>
    </form>
  );
}
