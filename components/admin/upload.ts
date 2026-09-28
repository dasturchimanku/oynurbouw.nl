import type { ProjectImage } from "@/lib/types";

export type UploadResult = ProjectImage & { originalName?: string };

export const ACCEPT_MEDIA = "image/*,image/gif,video/mp4,video/quicktime,video/webm,.heic,.heif,.mov,.mp4";

function videoSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.muted = true;
    const done = (w = 0, h = 0) => {
      URL.revokeObjectURL(url);
      resolve({ width: w || 1080, height: h || 1920 });
    };
    v.onloadedmetadata = () => done(v.videoWidth, v.videoHeight);
    v.onerror = () => done();
    setTimeout(() => done(), 5000);
    v.src = url;
  });
}

export async function uploadImage(file: File, onProgress?: (pct: number) => void): Promise<UploadResult> {
  const fd = new FormData();
  fd.append("file", file);
  if (file.type.startsWith("video/") || /\.(mov|mp4|webm|m4v)$/i.test(file.name)) {
    const { width, height } = await videoSize(file);
    fd.append("width", String(width));
    fd.append("height", String(height));
  }
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let body: { error?: string } & Partial<UploadResult> = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300) resolve(body as UploadResult);
      else reject(new Error(body.error || `Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(fd);
  });
}
