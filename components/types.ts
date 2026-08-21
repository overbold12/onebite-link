export type Folder = {
  id: string;
  name: string;
  count: number;
  color: string;
};

export type PreviewStyle =
  | "figma"
  | "github"
  | "notion"
  | "dribbble"
  | "vercel"
  | "medium";

export type Bookmark = {
  title: string;
  description: string;
  domain: string;
  folder: string;
  folderId: string;
  folderColor: string;
  icon: string;
  iconColor: string;
  preview: PreviewStyle;
};
