"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { Bookmark } from "@/components/types";

export const BOOKMARKS_STORAGE_KEY = "onebite-link.bookmarks";
export const DELETED_BOOKMARKS_STORAGE_KEY = "onebite-link.deleted-bookmarks";
export const BOOKMARK_EDITS_STORAGE_KEY = "onebite-link.bookmark-edits";
export const BOOKMARKS_USER_ID_STORAGE_KEY = "onebite-link.user-id";
export const BOOKMARKS_CHANGED_EVENT = "onebite-link:bookmarks-changed";

type DeletedBookmark = Pick<Bookmark, "id" | "folderId">;
export type BookmarkEdit = Pick<
  Bookmark,
  "id" | "title" | "description" | "folder" | "folderId" | "folderColor"
> & {
  originalFolderId: string;
};

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

function getBookmarkEditsSnapshot() {
  return window.localStorage.getItem(BOOKMARK_EDITS_STORAGE_KEY) ?? "";
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

function parseBookmarkEdits(storedEdits: string): BookmarkEdit[] {
  if (!storedEdits) return [];

  try {
    const parsed: unknown = JSON.parse(storedEdits);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (edit): edit is BookmarkEdit =>
        typeof edit === "object" &&
        edit !== null &&
        typeof edit.id === "string" &&
        typeof edit.title === "string" &&
        typeof edit.description === "string" &&
        typeof edit.folder === "string" &&
        typeof edit.folderId === "string" &&
        typeof edit.folderColor === "string" &&
        typeof edit.originalFolderId === "string",
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

export function useBookmarkEdits() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getBookmarkEditsSnapshot,
    getServerSnapshot,
  );
  return useMemo(() => parseBookmarkEdits(snapshot), [snapshot]);
}

export function resetBookmarkCacheForUser(userId: string | null) {
  const storedUserId = window.localStorage.getItem(BOOKMARKS_USER_ID_STORAGE_KEY);

  if (userId !== null && storedUserId === userId) return false;

  const storageKeys = [
    BOOKMARKS_STORAGE_KEY,
    DELETED_BOOKMARKS_STORAGE_KEY,
    BOOKMARK_EDITS_STORAGE_KEY,
  ];
  const hadCachedData = storageKeys.some(
    (storageKey) => window.localStorage.getItem(storageKey) !== null,
  );

  storageKeys.forEach((storageKey) => window.localStorage.removeItem(storageKey));

  if (userId === null) {
    window.localStorage.removeItem(BOOKMARKS_USER_ID_STORAGE_KEY);
  } else {
    window.localStorage.setItem(BOOKMARKS_USER_ID_STORAGE_KEY, userId);
  }

  if (hadCachedData || storedUserId !== userId) {
    window.dispatchEvent(new Event(BOOKMARKS_CHANGED_EVENT));
  }

  return true;
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

export function updateBookmark(bookmark: Bookmark) {
  const storedBookmarks = parseStoredBookmarks(
    window.localStorage.getItem(BOOKMARKS_STORAGE_KEY) ?? "",
  );
  const isStoredBookmark = storedBookmarks.some((item) => item.id === bookmark.id);

  if (isStoredBookmark) {
    window.localStorage.setItem(
      BOOKMARKS_STORAGE_KEY,
      JSON.stringify(
        storedBookmarks.map((item) => (item.id === bookmark.id ? bookmark : item)),
      ),
    );
  } else {
    const edits = parseBookmarkEdits(
      window.localStorage.getItem(BOOKMARK_EDITS_STORAGE_KEY) ?? "",
    );
    const existingEdit = edits.find((edit) => edit.id === bookmark.id);
    const nextEdit: BookmarkEdit = {
      id: bookmark.id,
      title: bookmark.title,
      description: bookmark.description,
      folder: bookmark.folder,
      folderId: bookmark.folderId,
      folderColor: bookmark.folderColor,
      originalFolderId: existingEdit?.originalFolderId ?? bookmark.folderId,
    };

    window.localStorage.setItem(
      BOOKMARK_EDITS_STORAGE_KEY,
      JSON.stringify([...edits.filter((edit) => edit.id !== bookmark.id), nextEdit]),
    );
  }

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
    const edits = parseBookmarkEdits(
      window.localStorage.getItem(BOOKMARK_EDITS_STORAGE_KEY) ?? "",
    );
    const existingEdit = edits.find((edit) => edit.id === bookmark.id);
    const deletedBookmarks = parseDeletedBookmarks(
      window.localStorage.getItem(DELETED_BOOKMARKS_STORAGE_KEY) ?? "",
    );

    if (!deletedBookmarks.some((item) => item.id === bookmark.id)) {
      window.localStorage.setItem(
        DELETED_BOOKMARKS_STORAGE_KEY,
        JSON.stringify([
          ...deletedBookmarks,
          {
            id: bookmark.id,
            folderId: existingEdit?.originalFolderId ?? bookmark.folderId,
          },
        ]),
      );
    }

    window.localStorage.setItem(
      BOOKMARK_EDITS_STORAGE_KEY,
      JSON.stringify(edits.filter((edit) => edit.id !== bookmark.id)),
    );
  }

  window.dispatchEvent(new Event(BOOKMARKS_CHANGED_EVENT));
}
