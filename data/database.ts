import { cache } from "react";
import type { Bookmark, Folder } from "@/components/types";
import { createClient } from "@/utils/supabase/server";

type FolderRow = {
  id: number;
  name: string;
  created_at: string;
};

type LinkRow = {
  id: number;
  url: string;
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  created_at: string;
  folder_id: number | null;
};

const DEFAULT_COLOR = "#3182f6";

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return url;
  }
}

export const getFoldersAndLinks = cache(async () => {
  const supabase = await createClient();
  const [foldersResult, linksResult] = await Promise.all([
    supabase
      .from("folders")
      .select("id, name, created_at")
      .order("created_at", { ascending: true })
      .order("id", { ascending: true }),
    supabase
      .from("links")
      .select("id, url, title, description, thumbnail_url, created_at, folder_id")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false }),
  ]);

  if (foldersResult.error) throw foldersResult.error;
  if (linksResult.error) throw linksResult.error;

  const folderRows = foldersResult.data as FolderRow[];
  const linkRows = linksResult.data as LinkRow[];
  const linkCountByFolderId = new Map<string, number>();

  linkRows.forEach((link) => {
    if (link.folder_id === null) return;
    const folderId = String(link.folder_id);
    linkCountByFolderId.set(folderId, (linkCountByFolderId.get(folderId) ?? 0) + 1);
  });

  const folders: Folder[] = folderRows.map((folder) => ({
    id: String(folder.id),
    name: folder.name,
    count: linkCountByFolderId.get(String(folder.id)) ?? 0,
    color: DEFAULT_COLOR,
  }));
  const foldersById = new Map(folders.map((folder) => [folder.id, folder]));

  const bookmarks: Bookmark[] = linkRows.map((link) => {
    const folderId = link.folder_id === null ? "" : String(link.folder_id);
    const folder = foldersById.get(folderId);
    const domain = getDomain(link.url);
    const title = link.title?.trim() || domain;

    return {
      id: String(link.id),
      url: link.url,
      title,
      description: link.description ?? "",
      domain,
      thumbnail: link.thumbnail_url,
      folder: folder?.name ?? "폴더 없음",
      folderId,
      folderColor: folder?.color ?? DEFAULT_COLOR,
      icon: (title || domain).slice(0, 1).toUpperCase(),
      iconColor: DEFAULT_COLOR,
    };
  });

  return { folders, bookmarks };
});
