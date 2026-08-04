import { Inter } from "next/font/google";

/**
 * Fonts live here rather than in the root layout so that next/font only
 * preloads them on the routes that actually use them. Keeping them at the root
 * meant every route — including the Poppins-based service landing pages —
 * preloaded ~71KB of unused typefaces ahead of its own font.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  // Next emits font preload links into the shared document head, so leaving
  // this on made every route — including the Poppins landing pages — preload
  // Inter's 48KB file at high priority. The homepage still loads it from CSS.
  preload: false,
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${inter.variable} font-sans`}>{children}</div>;
}
