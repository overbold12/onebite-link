"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ChevronDownIcon, PencilIcon } from "./icons";
import type { Bookmark, Folder } from "./types";

type EditLinkModalProps = {
  bookmark: Bookmark;
  folders: Folder[];
  onClose: () => void;
  onSave: (bookmark: Bookmark) => void;
};

export function EditLinkModal({ bookmark, folders, onClose, onSave }: EditLinkModalProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(bookmark.title);
  const [description, setDescription] = useState(bookmark.description);
  const [folderId, setFolderId] = useState(bookmark.folderId);
  const [error, setError] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    titleInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const folder = folders.find((item) => item.id === folderId);

    if (!trimmedTitle) {
      setError("제목을 입력해 주세요.");
      titleInputRef.current?.focus();
      return;
    }

    if (!folder) {
      setError("폴더를 선택해 주세요.");
      return;
    }

    onSave({
      ...bookmark,
      title: trimmedTitle,
      description: description.trim(),
      folder: folder.name,
      folderId: folder.id,
      folderColor: folder.color,
    });
  };

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[var(--overlay)] px-5 py-8 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-link-title"
        className="modal-panel w-full max-w-[520px] rounded-2xl bg-[var(--surface)] p-6 shadow-[var(--shadow-modal)] sm:p-7"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-accent)] text-[var(--accent)]">
          <PencilIcon className="h-6 w-6" />
        </div>
        <h2
          id="edit-link-title"
          className="mt-5 text-[22px] font-extrabold tracking-[-0.035em] text-[var(--text)]"
        >
          링크 정보 수정
        </h2>
        <p className="mt-2 text-[14px] leading-6 text-[var(--text-sub)]">
          폴더, 제목, 설명을 원하는 내용으로 바꿀 수 있어요.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <label htmlFor="edit-link-folder" className="text-[14px] font-bold text-[var(--text)]">
              폴더
            </label>
            <div className="relative mt-2.5">
              <select
                id="edit-link-folder"
                value={folderId}
                onChange={(event) => {
                  setFolderId(event.target.value);
                  setError("");
                }}
                className="h-[52px] w-full appearance-none rounded-xl border-0 bg-[var(--surface-subtle)] px-4 pr-11 text-[15px] text-[var(--text)] outline-none focus:bg-[var(--surface)] focus:ring-3 focus:ring-[var(--focus)]"
              >
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="edit-link-name" className="text-[14px] font-bold text-[var(--text)]">
              제목
            </label>
            <input
              ref={titleInputRef}
              id="edit-link-name"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError("");
              }}
              maxLength={120}
              aria-invalid={error ? "true" : undefined}
              className="mt-2.5 h-[52px] w-full rounded-xl border-0 bg-[var(--surface-subtle)] px-4 text-[15px] text-[var(--text)] outline-none placeholder:text-[var(--text-placeholder)] focus:bg-[var(--surface)] focus:ring-3 focus:ring-[var(--focus)]"
            />
          </div>

          <div className="mt-5">
            <label htmlFor="edit-link-description" className="text-[14px] font-bold text-[var(--text)]">
              설명
            </label>
            <textarea
              id="edit-link-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              maxLength={500}
              className="mt-2.5 w-full resize-none rounded-xl border-0 bg-[var(--surface-subtle)] px-4 py-3.5 text-[15px] leading-6 text-[var(--text)] outline-none placeholder:text-[var(--text-placeholder)] focus:bg-[var(--surface)] focus:ring-3 focus:ring-[var(--focus)]"
            />
          </div>

          <p aria-live="polite" className="mt-3 min-h-5 text-[13px] text-[var(--error)]">
            {error}
          </p>

          <div className="mt-4 flex justify-end gap-2 border-t border-[var(--border)] pt-6">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button h-12 rounded-xl bg-[var(--surface-subtle)] px-5 text-[15px] font-bold text-[var(--text-sub)]"
            >
              취소
            </button>
            <button
              type="submit"
              className="primary-button h-12 rounded-xl bg-[var(--accent)] px-6 text-[15px] font-bold text-white shadow-[var(--shadow-button)]"
            >
              저장
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
