"use client";

import { useEffect, useRef } from "react";
import { TrashIcon } from "./icons";
import type { Bookmark } from "./types";

type DeleteLinkModalProps = {
  bookmark: Bookmark | null;
  onClose: () => void;
  onConfirm: (bookmark: Bookmark) => void;
};

export function DeleteLinkModal({ bookmark, onClose, onConfirm }: DeleteLinkModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!bookmark) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [bookmark, onClose]);

  if (!bookmark) return null;

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)] px-5 py-8 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-link-title"
        aria-describedby="delete-link-description"
        className="modal-panel w-full max-w-[420px] rounded-2xl bg-[var(--surface)] p-6 shadow-[var(--shadow-modal)] sm:p-7"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--error-surface)] text-[var(--error)]">
          <TrashIcon className="h-6 w-6" />
        </div>
        <h2
          id="delete-link-title"
          className="mt-5 text-[22px] font-extrabold tracking-[-0.035em] text-[var(--text)]"
        >
          링크를 삭제할까요?
        </h2>
        <p id="delete-link-description" className="mt-2 text-[14px] leading-6 text-[var(--text-sub)]">
          <strong className="font-bold text-[var(--text)]">{bookmark.title}</strong> 링크가 목록에서
          삭제돼요. 정말 삭제할까요?
        </p>

        <div className="mt-7 flex justify-end gap-2">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            className="cancel-button h-12 rounded-xl bg-[var(--surface-subtle)] px-5 text-[15px] font-bold text-[var(--text-sub)]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => onConfirm(bookmark)}
            className="danger-button h-12 rounded-xl bg-[var(--error)] px-6 text-[15px] font-bold text-white shadow-[var(--shadow-danger)]"
          >
            삭제
          </button>
        </div>
      </section>
    </div>
  );
}
