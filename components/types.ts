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
  id: string;
  url: string;
  title: string;
  description: string;
  domain: string;
  thumbnail: string | null;
  folder: string;
  folderId: string;
  folderColor: string;
  icon: string;
  iconColor: string;
  preview?: PreviewStyle;
};

export type OpenGraphData = {
  title: string;
  description: string;
  thumbnail: string | null;
  url: string;
  domain: string;
};
