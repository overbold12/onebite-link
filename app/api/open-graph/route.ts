import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import type { OpenGraphData } from "@/components/types";

export const runtime = "nodejs";

const MAX_HTML_BYTES = 1_500_000;
const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT_MS = 8_000;

class OpenGraphError extends Error {
  constructor(
    message: string,
    readonly status = 422,
  ) {
    super(message);
  }
}

function isPublicIpv4(address: string) {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return false;

  const [first, second, third] = parts;

  if (first === 0 || first === 10 || first === 127 || first >= 224) return false;
  if (first === 100 && second >= 64 && second <= 127) return false;
  if (first === 169 && second === 254) return false;
  if (first === 172 && second >= 16 && second <= 31) return false;
  if (first === 192 && (second === 0 || second === 168)) return false;
  if (first === 198 && (second === 18 || second === 19)) return false;
  if (first === 198 && second === 51 && third === 100) return false;
  if (first === 203 && second === 0 && third === 113) return false;

  return true;
}

function isPublicIp(address: string) {
  const family = isIP(address);

  if (family === 4) return isPublicIpv4(address);
  if (family !== 6) return false;

  const normalized = address.toLowerCase();
  if (normalized.startsWith("::ffff:")) return false;
  if (normalized === "::" || normalized === "::1") return false;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return false;
  if (/^fe[89ab]/.test(normalized) || normalized.startsWith("ff")) return false;
  if (normalized.startsWith("2001:db8")) return false;

  return normalized.startsWith("2") || normalized.startsWith("3");
}

async function assertPublicUrl(candidate: URL) {
  if (candidate.protocol !== "http:" && candidate.protocol !== "https:") {
    throw new OpenGraphError("http 또는 https 링크만 저장할 수 있어요.", 400);
  }

  if (candidate.username || candidate.password) {
    throw new OpenGraphError("인증 정보가 포함된 링크는 저장할 수 없어요.", 400);
  }

  const hostname = candidate.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    throw new OpenGraphError("외부에서 접근 가능한 링크만 저장할 수 있어요.", 400);
  }

  if (isIP(hostname)) {
    if (!isPublicIp(hostname)) {
      throw new OpenGraphError("외부에서 접근 가능한 링크만 저장할 수 있어요.", 400);
    }
    return;
  }

  let addresses: Array<{ address: string; family: number }>;
  try {
    addresses = await lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new OpenGraphError("링크의 도메인을 찾을 수 없어요.");
  }

  if (addresses.length === 0 || addresses.some(({ address }) => !isPublicIp(address))) {
    throw new OpenGraphError("외부에서 접근 가능한 링크만 저장할 수 있어요.", 400);
  }
}

async function fetchHtml(initialUrl: URL) {
  let currentUrl = initialUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    await assertPublicUrl(currentUrl);

    let response: Response;
    try {
      response = await fetch(currentUrl, {
        cache: "no-store",
        redirect: "manual",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "User-Agent": "OnebiteLinkBot/1.0 (+OpenGraph preview)",
        },
      });
    } catch (error) {
      if (error instanceof Error && error.name === "TimeoutError") {
        throw new OpenGraphError("페이지 응답 시간이 너무 길어요.", 504);
      }
      throw new OpenGraphError("페이지에 연결할 수 없어요.");
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new OpenGraphError("페이지의 이동 주소가 올바르지 않아요.");
      if (redirectCount === MAX_REDIRECTS) {
        throw new OpenGraphError("페이지 이동 횟수가 너무 많아요.");
      }

      currentUrl = new URL(location, currentUrl);
      continue;
    }

    if (!response.ok) {
      throw new OpenGraphError(`페이지가 ${response.status} 상태로 응답했어요.`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (
      contentType &&
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      throw new OpenGraphError("HTML 페이지 링크만 저장할 수 있어요.", 415);
    }

    const contentLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_HTML_BYTES) {
      throw new OpenGraphError("페이지가 너무 커서 정보를 가져올 수 없어요.", 413);
    }

    return {
      html: await readLimitedHtml(response, contentType),
      finalUrl: currentUrl,
    };
  }

  throw new OpenGraphError("페이지 이동 횟수가 너무 많아요.");
}

async function readLimitedHtml(response: Response, contentType: string) {
  if (!response.body) throw new OpenGraphError("페이지 내용이 비어 있어요.");

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    byteLength += value.byteLength;
    if (byteLength > MAX_HTML_BYTES) {
      await reader.cancel();
      throw new OpenGraphError("페이지가 너무 커서 정보를 가져올 수 없어요.", 413);
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const asciiHead = new TextDecoder("utf-8").decode(bytes.slice(0, 4096));
  const charset =
    contentType.match(/charset\s*=\s*["']?([^;\s"']+)/i)?.[1] ??
    asciiHead.match(/<meta[^>]+charset\s*=\s*["']?([^\s"'/>]+)/i)?.[1] ??
    "utf-8";

  try {
    return new TextDecoder(charset).decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
}

function decodeHtmlEntities(value: string) {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value
    .replace(/&#(\d+);?/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);?/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (entity, name: string) => namedEntities[name.toLowerCase()] ?? entity)
    .replace(/\s+/g, " ")
    .trim();
}

function parseAttributes(tag: string) {
  const attributes = new Map<string, string>();
  const attributePattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  for (const match of tag.matchAll(attributePattern)) {
    const name = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? "";
    attributes.set(name, decodeHtmlEntities(value));
  }

  return attributes;
}

function extractMetadata(html: string) {
  const metadata = new Map<string, string>();

  for (const match of html.matchAll(/<meta\s+[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    const key = (attributes.get("property") ?? attributes.get("name") ?? "").toLowerCase();
    const content = attributes.get("content") ?? "";
    if (key && content && !metadata.has(key)) metadata.set(key, content);
  }

  const titleMatch = html.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title\s*>/i);

  return {
    title: metadata.get("og:title") ?? metadata.get("twitter:title") ?? decodeHtmlEntities(titleMatch?.[1] ?? ""),
    description:
      metadata.get("og:description") ??
      metadata.get("twitter:description") ??
      metadata.get("description") ??
      "",
    image: metadata.get("og:image:secure_url") ?? metadata.get("og:image") ?? metadata.get("twitter:image") ?? null,
  };
}

async function normalizeThumbnail(image: string | null, pageUrl: URL) {
  if (!image) return null;

  try {
    const thumbnailUrl = new URL(image, pageUrl);
    await assertPublicUrl(thumbnailUrl);
    return thumbnailUrl.toString();
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new OpenGraphError("요청 형식이 올바르지 않아요.", 400);
    }

    const rawUrl =
      typeof body === "object" && body !== null && "url" in body && typeof body.url === "string"
        ? body.url.trim()
        : "";

    if (!rawUrl) throw new OpenGraphError("링크 주소를 입력해 주세요.", 400);

    let requestedUrl: URL;
    try {
      requestedUrl = new URL(rawUrl);
    } catch {
      throw new OpenGraphError("올바른 링크 주소를 입력해 주세요.", 400);
    }

    const { html, finalUrl } = await fetchHtml(requestedUrl);
    const metadata = extractMetadata(html);
    const result: OpenGraphData = {
      title: metadata.title || finalUrl.hostname,
      description: metadata.description,
      thumbnail: await normalizeThumbnail(metadata.image, finalUrl),
      url: finalUrl.toString(),
      domain: finalUrl.hostname.replace(/^www\./i, ""),
    };

    return Response.json(result);
  } catch (error) {
    if (error instanceof OpenGraphError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json(
      { error: "링크 정보를 가져오는 중 문제가 생겼어요." },
      { status: 500 },
    );
  }
}
