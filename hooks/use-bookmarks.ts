"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { Bookmark } from "@/components/types";

export const BOOKMARKS_STORAGE_KEY = "onebite-link.bookmarks";
export const BOOKMARKS_CHANGED_EVENT = "onebite-link:bookmarks-changed";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(BOOKMARKS_CHANGED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(BOOKMARKS_CHANGED_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(BOOKMARKS_STORAGE_KEY) ?? "";
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

export function useStoredBookmarks() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => parseStoredBookmarks(snapshot), [snapshot]);
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
