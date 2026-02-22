import Image from "next/image";
import { clsx } from "clsx";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width = 140, height = 36 }: LogoProps) {
  return (
    <Image
      src="/logo.webp"
      alt="Upscalix"
      width={width}
      height={height}
      className={clsx("h-auto", className)}
      priority
    />
  );
}
