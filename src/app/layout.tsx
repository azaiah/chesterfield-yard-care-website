import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Graduate, Instrument_Serif, Inter } from "next/font/google";
import { themeInitScript } from "@/components/ThemeToggle";
import { share } from "@/lib/seo";
import { BRAND, SITE } from "@/lib/site";
import "./globals.css";

const graduate = Graduate({ weight: "400", subsets: ["latin"], variable: "--font-graduate", display: "swap" });
const barlow = Barlow_Condensed({ weight: ["600", "700", "800"], subsets: ["latin"], variable: "--font-barlow", display: "swap" });
const instrument = Instrument_Serif({ weight: "400", style: ["italic", "normal"], subsets: ["latin"], variable: "--font-instrument", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | Lawn Care & Yard Services in Chesterfield & Midlothian, VA`, template: `%s | ${SITE.name}` },
  description: `${SITE.tagline} Mowing, mulch & gravel, leaf cleanup, tree work, aeration and junk removal in Chesterfield County. Call or text ${SITE.phone} for a free quote.`,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: `${BRAND}/logo/logo-badge.svg`, type: "image/svg+xml" },
    ],
    apple: `${BRAND}/logo/icon-180.png`,
  },
  ...share("/"),
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8F2" },
    { media: "(prefers-color-scheme: dark)", color: "#07142B" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${graduate.variable} ${barlow.variable} ${instrument.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
