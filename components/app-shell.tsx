"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  useBookmarkEdits,
  useDeletedBookmarks,
  useStoredBookmarks,
} from "@/hooks/use-bookmarks";
import { createClient } from "@/utils/supabase/client";
import { AppHeader } from "./app-header";
import { DeleteFolderModal } from "./delete-folder-modal";
import { EditFolderModal } from "./edit-folder-modal";
import { NewFolderModal } from "./new-folder-modal";
import { Sidebar } from "./sidebar";
import type { Folder } from "./types";

const DELETED_FOLDERS_STORAGE_KEY = "onebite-link.deleted-folders";
const RENAMED_FOLDERS_STORAGE_KEY = "onebite-link.renamed-folders";
const CUSTOM_FOLDERS_EVENT = "onebite-link:folders-changed";

function subscribeToCustomFolders(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CUSTOM_FOLDERS_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CUSTOM_FOLDERS_EVENT, onStoreChange);
  };
}

function getCustomFoldersServerSnapshot() {
  return "";
}

function getDeletedFoldersSnapshot() {
  return window.localStorage.getItem(DELETED_FOLDERS_STORAGE_KEY) ?? "";
}

function getRenamedFoldersSnapshot() {
  return window.localStorage.getItem(RENAMED_FOLDERS_STORAGE_KEY) ?? "";
}

function parseDeletedFolderIds(storedFolderIds: string): string[] {
  if (!storedFolderIds) return [];

  try {
    const parsedFolderIds: unknown = JSON.parse(storedFolderIds);

    if (!Array.isArray(parsedFolderIds)) return [];

    return parsedFolderIds.filter((folderId): folderId is string => typeof folderId === "string");
  } catch {
    return [];
  }
}

function parseRenamedFolders(storedFolders: string): Record<string, string> {
  if (!storedFolders) return {};

  try {
    const parsedFolders: unknown = JSON.parse(storedFolders);

    if (typeof parsedFolders !== "object" || parsedFolders === null || Array.isArray(parsedFolders)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsedFolders).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
  } catch {
    return {};
  }
}

type AppShellProps = {
  children: ReactNode;
  totalCount: number;
  activeFolderId?: string | null;
};

export function AppShell({ children, totalCount, activeFolderId }: AppShellProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const storedBookmarks = useStoredBookmarks();
  const deletedBookmarks = useDeletedBookmarks();
  const bookmarkEdits = useBookmarkEdits();
  const [databaseFolders, setDatabaseFolders] = useState<Folder[]>([]);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const deletedFoldersSnapshot = useSyncExternalStore(
    subscribeToCustomFolders,
    getDeletedFoldersSnapshot,
    getCustomFoldersServerSnapshot,
  );
  const deletedFolderIds = useMemo(
    () => parseDeletedFolderIds(deletedFoldersSnapshot),
    [deletedFoldersSnapshot],
  );
  const renamedFoldersSnapshot = useSyncExternalStore(
    subscribeToCustomFolders,
    getRenamedFoldersSnapshot,
    getCustomFoldersServerSnapshot,
  );
  const renamedFolders = useMemo(
    () => parseRenamedFolders(renamedFoldersSnapshot),
    [renamedFoldersSnapshot],
  );

  useEffect(() => {
    let isCancelled = false;

    async function loadFolders() {
      const { data, error } = await supabase
        .from("folders")
        .select("id, name, created_at")
        .order("created_at", { ascending: true })
        .order("id", { ascending: true });

      if (error) {
        console.error("Failed to load folders", error);
        return;
      }

      if (!isCancelled) {
        setDatabaseFolders(
          data.map((folder) => ({
            id: String(folder.id),
            name: folder.name,
            count: 0,
            color: "#3182f6",
          })),
        );
      }
    }

    void loadFolders();

    return () => {
      isCancelled = true;
    };
  }, [supabase]);

  const allFolders = databaseFolders
    .filter((folder) => !deletedFolderIds.includes(folder.id))
    .map((folder) => ({
      ...folder,
      name: renamedFolders[folder.id] ?? folder.name,
      count: Math.max(
        0,
        folder.count -
          deletedBookmarks.filter((bookmark) => bookmark.folderId === folder.id).length -
          bookmarkEdits.filter(
            (edit) => edit.originalFolderId === folder.id && edit.folderId !== folder.id,
          ).length +
          bookmarkEdits.filter(
            (edit) => edit.originalFolderId !== folder.id && edit.folderId === folder.id,
          ).length +
          storedBookmarks.filter((bookmark) => bookmark.folderId === folder.id).length,
      ),
    }));

  const handleCreateFolder = async (name: string) => {
    const { data, error } = await supabase
      .from("folders")
      .insert({ name })
      .select("id, name, created_at")
      .single();

    if (error) throw error;

    setDatabaseFolders((currentFolders) => [
      ...currentFolders,
      {
        id: String(data.id),
        name: data.name,
        count: 0,
        color: "#3182f6",
      },
    ]);
    setIsFolderModalOpen(false);
  };

  const handleDeleteFolder = (folder: Folder) => {
    const nextDeletedFolderIds = [...new Set([...deletedFolderIds, folder.id])];
    window.localStorage.setItem(
      DELETED_FOLDERS_STORAGE_KEY,
      JSON.stringify(nextDeletedFolderIds),
    );

    window.dispatchEvent(new Event(CUSTOM_FOLDERS_EVENT));
    setFolderToDelete(null);

    if (activeFolderId === folder.id) router.replace("/");
  };

  const handleEditFolder = (folder: Folder, name: string) => {
    window.localStorage.setItem(
      RENAMED_FOLDERS_STORAGE_KEY,
      JSON.stringify({ ...renamedFolders, [folder.id]: name }),
    );

    window.dispatchEvent(new Event(CUSTOM_FOLDERS_EVENT));
    setFolderToEdit(null);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <AppHeader onNewFolder={() => setIsFolderModalOpen(true)} />
      <div className="mx-auto flex w-full max-w-[1440px] flex-col md:flex-row">
        <Sidebar
          folders={allFolders}
          totalCount={Math.max(0, totalCount - deletedBookmarks.length) + storedBookmarks.length}
          activeFolderId={activeFolderId}
          onNewFolder={() => setIsFolderModalOpen(true)}
          onEditFolder={setFolderToEdit}
          onDeleteFolder={setFolderToDelete}
        />
        <main className="min-w-0 flex-1 px-5 pb-16 pt-8 sm:px-7 md:px-8 lg:px-12 lg:pb-20 lg:pt-12">
          {children}
        </main>
      </div>
      <NewFolderModal
        isOpen={isFolderModalOpen}
        existingFolderNames={allFolders.map((folder) => folder.name)}
        onClose={() => setIsFolderModalOpen(false)}
        onSave={handleCreateFolder}
      />
      <DeleteFolderModal
        folder={folderToDelete}
        onClose={() => setFolderToDelete(null)}
        onConfirm={handleDeleteFolder}
      />
      {folderToEdit ? (
        <EditFolderModal
          key={folderToEdit.id}
          folder={folderToEdit}
          existingFolderNames={allFolders
            .filter((folder) => folder.id !== folderToEdit.id)
            .map((folder) => folder.name)}
          onClose={() => setFolderToEdit(null)}
          onSave={handleEditFolder}
        />
      ) : null}
    </div>
  );
}
