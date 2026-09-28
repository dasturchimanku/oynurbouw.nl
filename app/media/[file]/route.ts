import { promises as fs, createReadStream } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { UPLOAD_DIR } from "@/lib/store";

const types: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
};

export async function GET(req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  // Only simple file names: no path traversal.
  if (!/^[a-zA-Z0-9_-]+\.(webp|jpe?g|png|avif|gif|mp4|m4v|mov|webm)$/.test(file)) return new Response("Not found", { status: 404 });
  const full = path.join(UPLOAD_DIR, file);
  let size: number;
  try {
    size = (await fs.stat(full)).size;
  } catch {
    return new Response("Not found", { status: 404 });
  }
  const type = types[path.extname(file).toLowerCase()] || "application/octet-stream";
  const headers: Record<string, string> = {
    "Content-Type": type,
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
  };

  // Range requests are required for video playback on iPhone/Safari.
  const range = req.headers.get("range");
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    if (m) {
      const start = m[1] ? Number(m[1]) : Math.max(0, size - Number(m[2]));
      const end = m[1] && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
      if (start >= size || start > end) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
      const stream = Readable.toWeb(createReadStream(full, { start, end })) as ReadableStream;
      return new Response(stream, {
        status: 206,
        headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) },
      });
    }
  }
  const stream = Readable.toWeb(createReadStream(full)) as ReadableStream;
  return new Response(stream, { headers: { ...headers, "Content-Length": String(size) } });
}
