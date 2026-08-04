import { Poppins } from "next/font/google";

/**
 * The service landing pages use Poppins per the Figma design, while the
 * homepage stays on Inter. Scoping the font to this route group means the
 * homepage never downloads it. Only the four weights the design uses are
 * requested.
 */
const poppins = Poppins({
  variable: "--font-poppins-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    // These pages have no dark variant in the design, so the surface is pinned
    // light regardless of the visitor's colour-scheme preference.
    <div className={`${poppins.variable} bg-white font-poppins text-lp-navy`}>{children}</div>
  );
}
