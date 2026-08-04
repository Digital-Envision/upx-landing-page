import Image from "next/image";
import Link from "next/link";
import { LpContainer } from "./ui";

export function LandingFooter() {
  return (
    <footer className="bg-lp-navy">
      <LpContainer className="flex flex-col items-center justify-between gap-4 py-[36px] sm:flex-row">
        <Link href="/" aria-label="Upscalix home">
          <Image src="/landing/logo-footer.svg" alt="Upscalix" width={118} height={30} />
        </Link>
        <p className="text-[14px] font-medium leading-[21px] text-[#8b96bd]">
          © {new Date().getFullYear()} Upscalix. All rights reserved.
        </p>
      </LpContainer>
    </footer>
  );
}
