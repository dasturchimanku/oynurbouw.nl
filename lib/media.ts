import type { MediaType } from "./types";

export const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;
export const GIF_EXT = /\.gif$/i;

export function mediaTypeOf(item: { src: string; media?: MediaType }): MediaType {
  if (item.media) return item.media;
  if (VIDEO_EXT.test(item.src)) return "video";
  if (GIF_EXT.test(item.src)) return "gif";
  return "image";
}

/** Items that can be used as a still image (e.g. Open Graph, JSON-LD). */
export function isStill(item: { src: string; media?: MediaType }) {
  return mediaTypeOf(item) === "image";
}
