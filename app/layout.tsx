import type { Metadata } from "next";
import { createPageMetadata, metadataBase } from "@/utils/metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase,
  applicationName: "한입 링크",
  ...createPageMetadata(
    "한입 링크 | 나만의 링크 저장소",
    "필요한 링크를 한곳에 모아 깔끔하게 관리하세요.",
  ),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
