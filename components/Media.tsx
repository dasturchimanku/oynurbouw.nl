import Image from "next/image";
import type { MediaType } from "@/lib/types";
import { mediaTypeOf } from "@/lib/media";

type Item = { src: string; width: number; height: number; media?: MediaType; poster?: string; webm?: string };

/**
 * Renders a photo, an animated GIF/WebP (kept animated) or a looping video (GIF-style: autoplay, muted, no controls).
 */
export function Media({
  item,
  alt,
  fill,
  sizes,
  className = "",
  priority,
  quality,
  loading,
  fetchPriority,
}: {
  item: Item;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}) {
  const type = mediaTypeOf(item);
  if (type === "video") {
    return (
      <video
        key={item.src}
        poster={item.poster}
        autoPlay
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        aria-label={alt}
        width={fill ? undefined : item.width}
        height={fill ? undefined : item.height}
        className={`${fill ? "absolute inset-0 h-full w-full" : "h-auto w-full"} ${className}`}
      >
        {item.webm && <source src={item.webm} type="video/webm" />}
        <source src={item.src} type={/\.webm$/i.test(item.src) ? "video/webm" : /\.mov$/i.test(item.src) ? "video/mp4" : "video/mp4"} />
      </video>
    );
  }
  const common = { src: item.src, alt, sizes, className, priority, quality, loading, fetchPriority, unoptimized: type === "gif" };
  return fill ? <Image {...common} fill /> : <Image {...common} width={item.width} height={item.height} />;
}
