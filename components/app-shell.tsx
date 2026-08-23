"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BOOKMARKS_CHANGED_EVENT,
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
  const [databaseFolders, setDatabaseFolders] = useState<Folder[]>([]);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  useEffect(() => {
    let isCancelled = false;

    async function loadFolders() {
      const [foldersResult, linksResult] = await Promise.all([
        supabase
          .from("folders")
          .select("id, name, created_at")
          .order("created_at", { ascending: true })
          .order("id", { ascending: true }),
        supabase.from("links").select("folder_id"),
      ]);

      if (foldersResult.error) {
        console.error("Failed to load folders", foldersResult.error);
        return;
      }

      if (linksResult.error) {
        console.error("Failed to load folder link counts", linksResult.error);
        return;
      }

      if (!isCancelled) {
        const linkCountByFolderId = new Map<string, number>();

        for (const link of linksResult.data) {
          if (link.folder_id === null) continue;

          const folderId = String(link.folder_id);
          linkCountByFolderId.set(
            folderId,
            (linkCountByFolderId.get(folderId) ?? 0) + 1,
          );
        }

        setDatabaseFolders(
          foldersResult.data.map((folder) => ({
            id: String(folder.id),
            name: folder.name,
            count: linkCountByFolderId.get(String(folder.id)) ?? 0,
            color: "#3182f6",
          })),
        );
      }
    }

    void loadFolders();
    window.addEventListener(BOOKMARKS_CHANGED_EVENT, loadFolders);

    return () => {
      isCancelled = true;
      window.removeEventListener(BOOKMARKS_CHANGED_EVENT, loadFolders);
    };
  }, [supabase]);

  const allFolders = databaseFolders;

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

  const handleDeleteFolder = async (folder: Folder) => {
    const { data, error } = await supabase
      .from("folders")
      .delete()
      .eq("id", folder.id)
      .select("id")
      .single();

    if (error) {
      console.error("Failed to delete folder", error);
      return;
    }

    setDatabaseFolders((currentFolders) =>
      currentFolders.filter((currentFolder) => currentFolder.id !== String(data.id)),
    );
    setFolderToDelete(null);

    if (activeFolderId === folder.id) router.replace("/");
  };

  const handleEditFolder = async (folder: Folder, name: string) => {
    const { data, error } = await supabase
      .from("folders")
      .update({ name })
      .eq("id", folder.id)
      .select("id, name")
      .single();

    if (error) {
      console.error("Failed to update folder", error);
      return;
    }

    setDatabaseFolders((currentFolders) =>
      currentFolders.map((currentFolder) =>
        currentFolder.id === String(data.id)
          ? { ...currentFolder, name: data.name }
          : currentFolder,
      ),
    );
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
