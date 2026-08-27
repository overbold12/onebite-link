import { AppShell } from "@/components/app-shell";
import { LinkGrid } from "@/components/link-grid";
import { getFoldersAndLinks } from "@/data/database";

export default async function Home() {
  const { bookmarks, folders, userId } = await getFoldersAndLinks();

  return (
    <AppShell
      totalCount={bookmarks.length}
      activeFolderId={null}
      initialUserId={userId}
    >
      <LinkGrid bookmarks={bookmarks} folders={folders} userId={userId} />
    </AppShell>
  );
}
