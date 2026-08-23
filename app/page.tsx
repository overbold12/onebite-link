import { AppShell } from "@/components/app-shell";
import { LinkGrid } from "@/components/link-grid";
import { bookmarks, folders } from "@/data/bookmarks";

export default function Home() {
  return (
    <AppShell totalCount={bookmarks.length} activeFolderId={null}>
      <LinkGrid bookmarks={bookmarks} folders={folders} />
    </AppShell>
  );
}
