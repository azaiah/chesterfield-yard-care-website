import type { Metadata } from "next";
import { PortalApp } from "@/components/portal/PortalApp";
import { share } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Demo Portal",
  description: "Click through the Chesterfield Yard Care owner portal with sample data and guided tour cards.",
  ...share("/portal/demo", {
    title: "Owner Portal Demo | Chesterfield Yard Care",
    description: "Click through the owner portal: leads, quotes, jobs and the weekly Lead Sweep. Sample data, guided tour.",
  }),
};

// Public, sample data only, everything stays in the browser tab.
export default function DemoPortal() {
  return <PortalApp mode="demo" />;
}
