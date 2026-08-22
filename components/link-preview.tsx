import type { PreviewStyle } from "./types";

type LinkPreviewProps = {
  variant: PreviewStyle;
};

export function LinkPreview({ variant }: LinkPreviewProps) {
  if (variant === "figma") {
    return (
      <div className="relative h-full overflow-hidden bg-[var(--preview-figma-bg)]">
        <div className="absolute -right-5 -top-10 h-40 w-40 rounded-full bg-[var(--preview-figma-blob)]" />
        <div className="absolute left-[18%] top-[21%] grid grid-cols-2 drop-shadow-[var(--preview-figma-shadow)]">
          <span className="h-10 w-10 rounded-l-full rounded-tr-full bg-[var(--figma-red)]" />
          <span className="h-10 w-10 rounded-r-full bg-[var(--figma-coral)]" />
          <span className="h-10 w-10 rounded-l-full rounded-br-full bg-[var(--figma-purple)]" />
          <span className="h-10 w-10 rounded-full bg-[var(--figma-blue)]" />
          <span className="h-10 w-10 rounded-l-full rounded-br-full bg-[var(--figma-green)]" />
        </div>
        <div className="absolute right-[10%] top-[28%] h-[82px] w-[42%] rounded-xl border border-white/70 bg-white/80 p-3 shadow-sm">
          <span className="block h-2 w-12 rounded-full bg-[var(--preview-figma-line)]" />
          <span className="mt-3 block h-1.5 w-full rounded-full bg-[var(--preview-figma-line-soft)]" />
          <span className="mt-2 block h-1.5 w-3/4 rounded-full bg-[var(--preview-figma-line-soft)]" />
        </div>
      </div>
    );
  }

  if (variant === "github") {
    return (
      <div className="relative h-full bg-[var(--preview-github-bg)] px-[9%] py-[12%]">
        <div className="h-full rounded-lg border border-white/10 bg-[var(--preview-github-panel)] p-3 shadow-2xl">
          <div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--preview-github-red)]" /><span className="h-2 w-2 rounded-full bg-[var(--preview-github-yellow)]" /><span className="h-2 w-2 rounded-full bg-[var(--preview-github-green)]" /></div>
          <div className="mt-4 grid grid-cols-[32%_1fr] gap-3">
            <div className="space-y-2"><span className="block h-1.5 w-full rounded bg-white/15" /><span className="block h-1.5 w-4/5 rounded bg-white/10" /><span className="block h-1.5 w-3/5 rounded bg-white/10" /></div>
            <div className="space-y-2"><span className="block h-2 w-2/3 rounded bg-[var(--preview-github-blue)]" /><span className="block h-1.5 w-full rounded bg-white/10" /><span className="block h-1.5 w-5/6 rounded bg-white/10" /></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "notion") {
    return (
      <div className="relative flex h-full items-center justify-center bg-[var(--preview-notion-bg)]">
        <div className="absolute left-[8%] top-[12%] h-[76%] w-[84%] rotate-[-2deg] rounded-sm bg-white px-[12%] py-[10%] shadow-[var(--preview-notion-shadow)]">
          <div className="flex items-end gap-3"><span className="flex h-11 w-11 items-center justify-center border-2 border-black text-2xl font-black">N</span><span className="mb-1 h-3 w-20 rounded bg-[var(--preview-notion-ink)]" /></div>
          <span className="mt-5 block h-2 w-full rounded bg-[var(--preview-notion-line)]" /><span className="mt-2 block h-2 w-4/5 rounded bg-[var(--preview-notion-line-soft)]" />
        </div>
      </div>
    );
  }

  if (variant === "dribbble") {
    return (
      <div className="relative h-full overflow-hidden bg-[var(--preview-dribbble-bg)]">
        <div className="absolute -bottom-9 -left-7 h-36 w-36 rounded-full bg-[var(--preview-dribbble-blob)]" />
        <div className="absolute -right-7 -top-10 h-32 w-32 rounded-full bg-[var(--preview-dribbble-blob-warm)]" />
        <div className="absolute inset-[15%] rotate-3 rounded-[20px] bg-gradient-to-br from-[var(--preview-dribbble-from)] to-[var(--preview-dribbble-to)] p-5 shadow-[var(--preview-dribbble-shadow)]">
          <span className="block h-4 w-1/2 rounded-full bg-white/85" /><span className="mt-3 block h-2 w-3/4 rounded-full bg-white/40" />
          <div className="mt-5 flex gap-2"><span className="h-8 flex-1 rounded-lg bg-white/25" /><span className="h-8 flex-1 rounded-lg bg-white/25" /></div>
        </div>
      </div>
    );
  }

  if (variant === "vercel") {
    return (
      <div className="relative flex h-full items-center justify-center overflow-hidden bg-[var(--preview-vercel-bg)]">
        <div className="absolute h-[72%] w-[78%] rounded-2xl bg-white shadow-[var(--preview-vercel-shadow)]" />
        <div className="relative flex flex-col items-center">
          <span className="text-6xl leading-none text-black">▲</span>
          <span className="mt-4 h-2 w-24 rounded-full bg-black/80" />
          <span className="mt-2 h-1.5 w-16 rounded-full bg-black/15" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[var(--preview-medium-bg)]">
      <span className="absolute left-[10%] top-[18%] h-24 w-24 rounded-full bg-[var(--preview-medium-blob)]" />
      <div className="relative w-[76%] rotate-[-2deg] rounded-xl bg-[var(--preview-medium-paper)] p-5 shadow-[var(--preview-medium-shadow)]">
        <span className="text-3xl font-black tracking-[-0.08em] text-[var(--preview-medium-ink)]">Medium</span>
        <span className="mt-4 block h-2 w-full rounded-full bg-[var(--preview-medium-line)]" /><span className="mt-2 block h-2 w-4/5 rounded-full bg-[var(--preview-medium-line-soft)]" /><span className="mt-2 block h-2 w-2/3 rounded-full bg-[var(--preview-medium-line-soft)]" />
      </div>
    </div>
  );
}
