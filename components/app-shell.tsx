import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { Sidebar } from "./sidebar";
import type { Folder } from "./types";

type AppShellProps = {
  children: ReactNode;
  folders: Folder[];
  totalCount: number;
  activeFolderId?: string | null;
};

export function AppShell({ children, folders, totalCount, activeFolderId }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <AppHeader />
      <div className="mx-auto flex w-full max-w-[1440px] flex-col md:flex-row">
        <Sidebar folders={folders} totalCount={totalCount} activeFolderId={activeFolderId} />
        <main className="min-w-0 flex-1 px-5 pb-16 pt-8 sm:px-7 md:px-8 lg:px-12 lg:pb-20 lg:pt-12">
          {children}
        </main>
      </div>
    </div>
  );
}
