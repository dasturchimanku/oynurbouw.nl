import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getSession } from "@/lib/auth";
import { UPLOAD_DIR, newId } from "@/lib/store";

export const runtime = "nodejs";

const MAX_IMAGE = 40 * 1024 * 1024; // 40 MB
const MAX_VIDEO = 200 * 1024 * 1024; // 200 MB

const VIDEO_TYPES: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/quicktime": ".mov",
  "video/webm": ".webm",
  "video/x-m4v": ".m4v",
};

function extOf(name: string) {
  return path.extname(name).toLowerCase();
}

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Not logged in — please log in again." }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") return NextResponse.json({ error: "No file received" }, { status: 400 });

  const ext = extOf(file.name);
  const isVideo = file.type.startsWith("video/") || [".mp4", ".mov", ".webm", ".m4v"].includes(ext);
  const isGif = file.type === "image/gif" || ext === ".gif";
  const isImage = file.type.startsWith("image/") || [".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", ".heif", ".gif"].includes(ext);

  if (!isVideo && !isImage) return NextResponse.json({ error: "Only photos, GIFs and videos are allowed" }, { status: 415 });
  if (file.size > (isVideo ? MAX_VIDEO : MAX_IMAGE)) {
    return NextResponse.json({ error: `File too large (max ${isVideo ? 200 : 40} MB)` }, { status: 413 });
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const input = Buffer.from(await file.arrayBuffer());
  const id = newId();
  const base = { id, alt: { nl: "", en: "" }, kind: "gallery" as const, originalName: file.name.replace(/\.[^.]+$/, "") };

  try {
    /* ── Video: stored as-is, shown like a GIF (autoplay, muted, loop) ── */
    if (isVideo) {
      const vext = VIDEO_TYPES[file.type] || ([".mp4", ".mov", ".webm", ".m4v"].includes(ext) ? ext : ".mp4");
      const name = `${newId(10)}${vext}`;
      await fs.writeFile(path.join(UPLOAD_DIR, name), input);
      const width = Number(form?.get("width")) || 1080;
      const height = Number(form?.get("height")) || 1920;
      return NextResponse.json({ ...base, src: `/media/${name}`, width, height, media: "video" });
    }

    /* ── GIF: keep the animation (converted to a smaller animated WebP) ── */
    if (isGif) {
      try {
        const img = sharp(input, { animated: true, failOn: "none" });
        const meta = await img.metadata();
        const out = await img
          .resize({ width: Math.min(meta.width || 1080, 1080), withoutEnlargement: true })
          .webp({ quality: 80, effort: 4 })
          .toBuffer({ resolveWithObject: true });
        const name = `${newId(10)}.webp`;
        await fs.writeFile(path.join(UPLOAD_DIR, name), out.data);
        const frames = meta.pages || 1;
        const height = out.info.pageHeight || Math.round(out.info.height / frames);
        return NextResponse.json({ ...base, src: `/media/${name}`, width: out.info.width, height, media: frames > 1 ? "gif" : "image" });
      } catch {
        const name = `${newId(10)}.gif`;
        await fs.writeFile(path.join(UPLOAD_DIR, name), input);
        const meta = await sharp(input).metadata().catch(() => ({ width: 800, height: 800 }));
        return NextResponse.json({ ...base, src: `/media/${name}`, width: meta.width || 800, height: meta.height || 800, media: "gif" });
      }
    }

    /* ── Photo: rotated, resized and converted to WebP ── */
    const { data, info } = await sharp(input, { failOn: "none" })
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    const name = `${newId(10)}.webp`;
    await fs.writeFile(path.join(UPLOAD_DIR, name), data);
    return NextResponse.json({ ...base, src: `/media/${name}`, width: info.width, height: info.height, media: "image" });
  } catch (e) {
    console.error("Upload failed", e);
    // Last resort: keep the original file if it is a browser-friendly format.
    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      const name = `${newId(10)}${ext === ".jpeg" ? ".jpg" : ext}`;
      await fs.writeFile(path.join(UPLOAD_DIR, name), input);
      return NextResponse.json({ ...base, src: `/media/${name}`, width: 1600, height: 1200, media: "image" });
    }
    return NextResponse.json({ error: "Could not process this file. Try a JPG, PNG, GIF or MP4." }, { status: 422 });
  }
}
