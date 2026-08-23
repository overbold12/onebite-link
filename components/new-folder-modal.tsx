"use client";

import { useEffect, useRef, useState } from "react";
import { FolderIcon } from "./icons";

type NewFolderModalProps = {
  isOpen: boolean;
  existingFolderNames: string[];
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
};

export function NewFolderModal({
  isOpen,
  existingFolderNames,
  onClose,
  onSave,
}: NewFolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const submitLockRef = useRef(false);
  const normalizedName = folderName.trim();
  const isDuplicate = existingFolderNames.some(
    (name) => name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase(),
  );

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFolderName("");
    setSaveError(null);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!normalizedName || isDuplicate || submitLockRef.current) return;

    submitLockRef.current = true;
    setIsSubmitting(true);
    setSaveError(null);

    try {
      await onSave(normalizedName);
      setFolderName("");
    } catch {
      setSaveError("폴더를 저장하지 못했어요. 다시 시도해 주세요.");
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)] px-5 py-8 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-folder-title"
        className="modal-panel w-full max-w-[420px] rounded-2xl bg-[var(--surface)] p-6 shadow-[var(--shadow-modal)] sm:p-7"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-accent)] text-[var(--accent)]">
          <FolderIcon className="h-6 w-6" />
        </div>
        <h2
          id="new-folder-title"
          className="mt-5 text-[22px] font-extrabold tracking-[-0.035em] text-[var(--text)]"
        >
          새 폴더 만들기
        </h2>
        <p className="mt-1.5 text-[14px] leading-6 text-[var(--text-sub)]">
          링크를 주제별로 모아둘 폴더 이름을 입력해 주세요.
        </p>

        <form className="mt-6" onSubmit={handleSubmit}>
          <label htmlFor="folder-name" className="text-[14px] font-bold text-[var(--text)]">
            폴더 이름
          </label>
          <input
            ref={inputRef}
            id="folder-name"
            name="folderName"
            type="text"
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
            maxLength={30}
            autoComplete="off"
            placeholder="예: 나중에 읽을 글"
            aria-invalid={isDuplicate}
            aria-describedby={
              isDuplicate || saveError ? "folder-name-error" : undefined
            }
            className="mt-2.5 h-[52px] w-full rounded-xl border-0 bg-[var(--surface-subtle)] px-4 text-[15px] text-[var(--text)] outline-none placeholder:text-[var(--text-placeholder)] focus:bg-[var(--surface)] focus:ring-3 focus:ring-[var(--focus)] aria-invalid:ring-2 aria-invalid:ring-[var(--error)]"
          />
          <div className="mt-2 flex min-h-5 items-start justify-between gap-3 text-[12px]">
            {isDuplicate || saveError ? (
              <p id="folder-name-error" className="text-[var(--error)]">
                {isDuplicate ? "이미 같은 이름의 폴더가 있어요." : saveError}
              </p>
            ) : (
              <span />
            )}
            <span className="shrink-0 text-[var(--text-muted)]">{folderName.length}/30</span>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="cancel-button h-12 rounded-xl bg-[var(--surface-subtle)] px-5 text-[15px] font-bold text-[var(--text-sub)]"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!normalizedName || isDuplicate || isSubmitting}
              className="primary-button h-12 rounded-xl bg-[var(--accent)] px-6 text-[15px] font-bold text-white shadow-[var(--shadow-button)] disabled:cursor-not-allowed disabled:bg-[var(--disabled)] disabled:text-[var(--text-muted)] disabled:shadow-none"
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
