import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { LinkGrid } from "@/components/link-grid";
import { getFoldersAndLinks } from "@/data/database";

type FolderPageProps = {
  params: Promise<{ folderId: string }>;
};

export async function generateMetadata({ params }: FolderPageProps): Promise<Metadata> {
  const { folderId } = await params;
  const { folders } = await getFoldersAndLinks();
  const folder = folders.find((item) => item.id === folderId);

  if (!folder) return {};

  return {
    title: `${folder.name} | 한입 링크`,
    description: `${folder.name} 폴더에 저장한 링크를 확인하세요.`,
  };
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderId } = await params;
  const { bookmarks, folders } = await getFoldersAndLinks();
  const folder = folders.find((item) => item.id === folderId);

  if (!folder) notFound();

  return (
    <AppShell totalCount={bookmarks.length} activeFolderId={folder.id}>
      <LinkGrid
        bookmarks={bookmarks}
        folders={folders}
        title={folder.name}
        eyebrow="Folder collection"
        description={`${folder.name} 폴더에 저장된 링크를 모아봤어요.`}
        folderId={folder.id}
      />
    </AppShell>
  );
}
