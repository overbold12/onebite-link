"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { Bookmark } from "@/components/types";

export const BOOKMARKS_STORAGE_KEY = "onebite-link.bookmarks";
export const DELETED_BOOKMARKS_STORAGE_KEY = "onebite-link.deleted-bookmarks";
export const BOOKMARKS_CHANGED_EVENT = "onebite-link:bookmarks-changed";

type DeletedBookmark = Pick<Bookmark, "id" | "folderId">;

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(BOOKMARKS_CHANGED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(BOOKMARKS_CHANGED_EVENT, onStoreChange);
  };
}

function getBookmarksSnapshot() {
  return window.localStorage.getItem(BOOKMARKS_STORAGE_KEY) ?? "";
}

function getDeletedBookmarksSnapshot() {
  return window.localStorage.getItem(DELETED_BOOKMARKS_STORAGE_KEY) ?? "";
}

function getServerSnapshot() {
  return "";
}

function isStoredBookmark(value: unknown): value is Bookmark {
  if (typeof value !== "object" || value === null) return false;

  const bookmark = value as Partial<Bookmark>;

  return (
    typeof bookmark.id === "string" &&
    typeof bookmark.url === "string" &&
    typeof bookmark.title === "string" &&
    typeof bookmark.description === "string" &&
    typeof bookmark.domain === "string" &&
    (typeof bookmark.thumbnail === "string" || bookmark.thumbnail === null) &&
    typeof bookmark.folder === "string" &&
    typeof bookmark.folderId === "string" &&
    typeof bookmark.folderColor === "string" &&
    typeof bookmark.icon === "string" &&
    typeof bookmark.iconColor === "string"
  );
}

export function parseStoredBookmarks(storedBookmarks: string): Bookmark[] {
  if (!storedBookmarks) return [];

  try {
    const parsed: unknown = JSON.parse(storedBookmarks);
    return Array.isArray(parsed) ? parsed.filter(isStoredBookmark) : [];
  } catch {
    return [];
  }
}

function parseDeletedBookmarks(storedBookmarks: string): DeletedBookmark[] {
  if (!storedBookmarks) return [];

  try {
    const parsed: unknown = JSON.parse(storedBookmarks);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (bookmark): bookmark is DeletedBookmark =>
        typeof bookmark === "object" &&
        bookmark !== null &&
        typeof bookmark.id === "string" &&
        typeof bookmark.folderId === "string",
    );
  } catch {
    return [];
  }
}

export function useStoredBookmarks() {
  const snapshot = useSyncExternalStore(subscribe, getBookmarksSnapshot, getServerSnapshot);
  return useMemo(() => parseStoredBookmarks(snapshot), [snapshot]);
}

export function useDeletedBookmarks() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getDeletedBookmarksSnapshot,
    getServerSnapshot,
  );
  return useMemo(() => parseDeletedBookmarks(snapshot), [snapshot]);
}

export function saveBookmark(bookmark: Bookmark) {
  const current = parseStoredBookmarks(
    window.localStorage.getItem(BOOKMARKS_STORAGE_KEY) ?? "",
  );

  window.localStorage.setItem(
    BOOKMARKS_STORAGE_KEY,
    JSON.stringify([bookmark, ...current]),
  );
  window.dispatchEvent(new Event(BOOKMARKS_CHANGED_EVENT));
}

export function deleteBookmark(bookmark: Bookmark) {
  const current = parseStoredBookmarks(
    window.localStorage.getItem(BOOKMARKS_STORAGE_KEY) ?? "",
  );
  const isStoredBookmark = current.some((item) => item.id === bookmark.id);

  if (isStoredBookmark) {
    window.localStorage.setItem(
      BOOKMARKS_STORAGE_KEY,
      JSON.stringify(current.filter((item) => item.id !== bookmark.id)),
    );
  } else {
    const deletedBookmarks = parseDeletedBookmarks(
      window.localStorage.getItem(DELETED_BOOKMARKS_STORAGE_KEY) ?? "",
    );

    if (!deletedBookmarks.some((item) => item.id === bookmark.id)) {
      window.localStorage.setItem(
        DELETED_BOOKMARKS_STORAGE_KEY,
        JSON.stringify([
          ...deletedBookmarks,
          { id: bookmark.id, folderId: bookmark.folderId },
        ]),
      );
    }
  }

  window.dispatchEvent(new Event(BOOKMARKS_CHANGED_EVENT));
}
