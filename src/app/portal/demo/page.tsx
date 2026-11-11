import type { Metadata } from "next";
import { PortalApp } from "@/components/portal/PortalApp";

export const metadata: Metadata = {
  title: "Demo Portal",
  description: "Click through the Chesterfield Yard Care owner portal with sample data and guided tour cards.",
};

// Public, sample data only, everything stays in the browser tab.
export default function DemoPortal() {
  return <PortalApp mode="demo" />;
}
