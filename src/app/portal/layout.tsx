import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Owner Portal", template: "%s | Chesterfield Yard Care" },
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "CYC Portal", statusBarStyle: "black-translucent" },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
