import type { PreviewStyle } from "./types";

type LinkPreviewProps = {
  variant: PreviewStyle;
};

export function LinkPreview({ variant }: LinkPreviewProps) {
  if (variant === "figma") {
    return (
      <div className="relative h-full overflow-hidden bg-[#f3f1ff]">
        <div className="absolute -right-5 -top-10 h-40 w-40 rounded-full bg-[#d9d4ff]" />
        <div className="absolute left-[18%] top-[21%] grid grid-cols-2 drop-shadow-[0_12px_18px_rgba(84,68,180,0.18)]">
          <span className="h-10 w-10 rounded-l-full rounded-tr-full bg-[#f24e1e]" />
          <span className="h-10 w-10 rounded-r-full bg-[#ff7262]" />
          <span className="h-10 w-10 rounded-l-full rounded-br-full bg-[#a259ff]" />
          <span className="h-10 w-10 rounded-full bg-[#1abcfe]" />
          <span className="h-10 w-10 rounded-l-full rounded-br-full bg-[#0acf83]" />
        </div>
        <div className="absolute right-[10%] top-[28%] h-[82px] w-[42%] rounded-xl border border-white/70 bg-white/80 p-3 shadow-sm">
          <span className="block h-2 w-12 rounded-full bg-[#c9c4ee]" />
          <span className="mt-3 block h-1.5 w-full rounded-full bg-[#e4e1f7]" />
          <span className="mt-2 block h-1.5 w-3/4 rounded-full bg-[#e4e1f7]" />
        </div>
      </div>
    );
  }

  if (variant === "github") {
    return (
      <div className="relative h-full bg-[#1d222b] px-[9%] py-[12%]">
        <div className="h-full rounded-lg border border-white/10 bg-[#252b35] p-3 shadow-2xl">
          <div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-[#ff6b65]" /><span className="h-2 w-2 rounded-full bg-[#ffc75a]" /><span className="h-2 w-2 rounded-full bg-[#59cd78]" /></div>
          <div className="mt-4 grid grid-cols-[32%_1fr] gap-3">
            <div className="space-y-2"><span className="block h-1.5 w-full rounded bg-white/15" /><span className="block h-1.5 w-4/5 rounded bg-white/10" /><span className="block h-1.5 w-3/5 rounded bg-white/10" /></div>
            <div className="space-y-2"><span className="block h-2 w-2/3 rounded bg-[#6b93bd]" /><span className="block h-1.5 w-full rounded bg-white/10" /><span className="block h-1.5 w-5/6 rounded bg-white/10" /></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "notion") {
    return (
      <div className="relative flex h-full items-center justify-center bg-[#f4f2ed]">
        <div className="absolute left-[8%] top-[12%] h-[76%] w-[84%] rotate-[-2deg] rounded-sm bg-white px-[12%] py-[10%] shadow-[0_12px_30px_rgba(68,58,40,0.13)]">
          <div className="flex items-end gap-3"><span className="flex h-11 w-11 items-center justify-center border-2 border-black text-2xl font-black">N</span><span className="mb-1 h-3 w-20 rounded bg-[#292929]" /></div>
          <span className="mt-5 block h-2 w-full rounded bg-[#dedbd4]" /><span className="mt-2 block h-2 w-4/5 rounded bg-[#e7e4de]" />
        </div>
      </div>
    );
  }

  if (variant === "dribbble") {
    return (
      <div className="relative h-full overflow-hidden bg-[#ffeaf2]">
        <div className="absolute -bottom-9 -left-7 h-36 w-36 rounded-full bg-[#f8bdd2]" />
        <div className="absolute -right-7 -top-10 h-32 w-32 rounded-full bg-[#ffd3a8]" />
        <div className="absolute inset-[15%] rotate-3 rounded-[20px] bg-gradient-to-br from-[#ff8db6] to-[#d95791] p-5 shadow-[0_15px_30px_rgba(194,65,120,0.25)]">
          <span className="block h-4 w-1/2 rounded-full bg-white/85" /><span className="mt-3 block h-2 w-3/4 rounded-full bg-white/40" />
          <div className="mt-5 flex gap-2"><span className="h-8 flex-1 rounded-lg bg-white/25" /><span className="h-8 flex-1 rounded-lg bg-white/25" /></div>
        </div>
      </div>
    );
  }

  if (variant === "vercel") {
    return (
      <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#efeff1]">
        <div className="absolute h-[72%] w-[78%] rounded-2xl bg-white shadow-[0_14px_35px_rgba(0,0,0,0.1)]" />
        <div className="relative flex flex-col items-center">
          <span className="text-6xl leading-none text-black">▲</span>
          <span className="mt-4 h-2 w-24 rounded-full bg-black/80" />
          <span className="mt-2 h-1.5 w-16 rounded-full bg-black/15" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#dff1df]">
      <span className="absolute left-[10%] top-[18%] h-24 w-24 rounded-full bg-[#b7dab5]" />
      <div className="relative w-[76%] rotate-[-2deg] rounded-xl bg-[#fcfbf4] p-5 shadow-[0_14px_30px_rgba(58,91,55,0.16)]">
        <span className="text-3xl font-black tracking-[-0.08em] text-[#1c1c18]">Medium</span>
        <span className="mt-4 block h-2 w-full rounded-full bg-[#cac9c0]" /><span className="mt-2 block h-2 w-4/5 rounded-full bg-[#dfded5]" /><span className="mt-2 block h-2 w-2/3 rounded-full bg-[#dfded5]" />
      </div>
    </div>
  );
}
