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
    <div className="min-h-screen bg-[#f7f8fb] text-[#17171c]">
      <AppHeader />
      <div className="mx-auto flex w-full max-w-[1600px]">
        <Sidebar folders={folders} totalCount={totalCount} activeFolderId={activeFolderId} />
        <main className="min-w-0 flex-1 px-5 pb-14 pt-8 sm:px-7 lg:px-10 lg:pt-10">
          {children}
        </main>
      </div>
    </div>
  );
}
