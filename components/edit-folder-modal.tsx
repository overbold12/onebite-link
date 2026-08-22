"use client";

import { useEffect, useRef, useState } from "react";
import { PencilIcon } from "./icons";
import type { Folder } from "./types";

type EditFolderModalProps = {
  folder: Folder;
  existingFolderNames: string[];
  onClose: () => void;
  onSave: (folder: Folder, name: string) => void;
};

export function EditFolderModal({
  folder,
  existingFolderNames,
  onClose,
  onSave,
}: EditFolderModalProps) {
  const [folderName, setFolderName] = useState(folder.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const normalizedName = folderName.trim();
  const hasChanged = normalizedName !== folder.name;
  const isDuplicate = existingFolderNames.some(
    (name) => name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase(),
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    inputRef.current?.select();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!normalizedName || !hasChanged || isDuplicate) return;

    onSave(folder, normalizedName);
  };

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)] px-5 py-8 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-folder-title"
        className="modal-panel w-full max-w-[420px] rounded-2xl bg-[var(--surface)] p-6 shadow-[var(--shadow-modal)] sm:p-7"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-accent)] text-[var(--accent)]">
          <PencilIcon className="h-6 w-6" />
        </div>
        <h2
          id="edit-folder-title"
          className="mt-5 text-[22px] font-extrabold tracking-[-0.035em] text-[var(--text)]"
        >
          폴더 이름 수정
        </h2>
        <p className="mt-1.5 text-[14px] leading-6 text-[var(--text-sub)]">
          폴더를 알아보기 쉬운 이름으로 변경해 보세요.
        </p>

        <form className="mt-6" onSubmit={handleSubmit}>
          <label htmlFor="edit-folder-name" className="text-[14px] font-bold text-[var(--text)]">
            폴더 이름
          </label>
          <input
            ref={inputRef}
            id="edit-folder-name"
            name="folderName"
            type="text"
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
            maxLength={30}
            autoComplete="off"
            aria-invalid={isDuplicate}
            aria-describedby={isDuplicate ? "edit-folder-name-error" : undefined}
            className="mt-2.5 h-[52px] w-full rounded-xl border-0 bg-[var(--surface-subtle)] px-4 text-[15px] text-[var(--text)] outline-none placeholder:text-[var(--text-placeholder)] focus:bg-[var(--surface)] focus:ring-3 focus:ring-[var(--focus)] aria-invalid:ring-2 aria-invalid:ring-[var(--error)]"
          />
          <div className="mt-2 flex min-h-5 items-start justify-between gap-3 text-[12px]">
            {isDuplicate ? (
              <p id="edit-folder-name-error" className="text-[var(--error)]">
                이미 같은 이름의 폴더가 있어요.
              </p>
            ) : (
              <span />
            )}
            <span className="shrink-0 text-[var(--text-muted)]">{folderName.length}/30</span>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button h-12 rounded-xl bg-[var(--surface-subtle)] px-5 text-[15px] font-bold text-[var(--text-sub)]"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!normalizedName || !hasChanged || isDuplicate}
              className="primary-button h-12 rounded-xl bg-[var(--accent)] px-6 text-[15px] font-bold text-white shadow-[var(--shadow-button)] disabled:cursor-not-allowed disabled:bg-[var(--disabled)] disabled:text-[var(--text-muted)] disabled:shadow-none"
            >
              저장
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
