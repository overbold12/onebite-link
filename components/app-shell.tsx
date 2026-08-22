"use client";

import type { ReactNode } from "react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { AppHeader } from "./app-header";
import { NewFolderModal } from "./new-folder-modal";
import { Sidebar } from "./sidebar";
import type { Folder } from "./types";

const CUSTOM_FOLDERS_STORAGE_KEY = "onebite-link.custom-folders";
const CUSTOM_FOLDERS_EVENT = "onebite-link:folders-changed";

function subscribeToCustomFolders(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CUSTOM_FOLDERS_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CUSTOM_FOLDERS_EVENT, onStoreChange);
  };
}

function getCustomFoldersSnapshot() {
  return window.localStorage.getItem(CUSTOM_FOLDERS_STORAGE_KEY) ?? "";
}

function getCustomFoldersServerSnapshot() {
  return "";
}

function parseCustomFolders(storedFolders: string): Folder[] {
  if (!storedFolders) return [];

  try {
    const parsedFolders: unknown = JSON.parse(storedFolders);

    if (!Array.isArray(parsedFolders)) return [];

    return parsedFolders.filter(
      (folder): folder is Folder =>
        typeof folder === "object" &&
        folder !== null &&
        typeof folder.id === "string" &&
        typeof folder.name === "string" &&
        typeof folder.count === "number" &&
        typeof folder.color === "string",
    );
  } catch {
    return [];
  }
}

type AppShellProps = {
  children: ReactNode;
  folders: Folder[];
  totalCount: number;
  activeFolderId?: string | null;
};

export function AppShell({ children, folders, totalCount, activeFolderId }: AppShellProps) {
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const customFoldersSnapshot = useSyncExternalStore(
    subscribeToCustomFolders,
    getCustomFoldersSnapshot,
    getCustomFoldersServerSnapshot,
  );
  const customFolders = useMemo(
    () => parseCustomFolders(customFoldersSnapshot),
    [customFoldersSnapshot],
  );

  const allFolders = [
    ...folders,
    ...customFolders.filter(
      (customFolder) => !folders.some((folder) => folder.id === customFolder.id),
    ),
  ];

  const handleCreateFolder = (name: string) => {
    const newFolder: Folder = {
      id: `custom-${crypto.randomUUID()}`,
      name,
      count: 0,
      color: "#3182f6",
    };

    const nextFolders = [...customFolders, newFolder];
    window.localStorage.setItem(CUSTOM_FOLDERS_STORAGE_KEY, JSON.stringify(nextFolders));
    window.dispatchEvent(new Event(CUSTOM_FOLDERS_EVENT));
    setIsFolderModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <AppHeader onNewFolder={() => setIsFolderModalOpen(true)} />
      <div className="mx-auto flex w-full max-w-[1440px] flex-col md:flex-row">
        <Sidebar
          folders={allFolders}
          totalCount={totalCount}
          activeFolderId={activeFolderId}
          onNewFolder={() => setIsFolderModalOpen(true)}
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
    </div>
  );
}
