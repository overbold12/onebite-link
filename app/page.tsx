import { AppShell } from "@/components/app-shell";
import { LinkGrid } from "@/components/link-grid";
import { getFoldersAndLinks } from "@/data/database";

export default async function Home() {
  const { bookmarks, folders } = await getFoldersAndLinks();

  return (
    <AppShell totalCount={bookmarks.length} activeFolderId={null}>
      <LinkGrid bookmarks={bookmarks} folders={folders} />
    </AppShell>
  );
}
