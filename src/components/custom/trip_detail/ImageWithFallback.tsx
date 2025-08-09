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
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/placeholder-logo.png"; // Fallback khi ảnh lỗi
      }}
    />
  );
}