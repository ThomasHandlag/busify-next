"use client";

import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function ImageWithFallback({ src, alt, width, height, className }: ImageWithFallbackProps) {
  return (
    <Image aria-label="Image11"
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/avatar-holder.png"; // Fallback khi ảnh lỗi
      }}
    />
  );
}