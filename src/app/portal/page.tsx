import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalApp } from "@/components/portal/PortalApp";
import type { Tab } from "@/components/portal/context";
import { isOwner } from "@/lib/server/auth";
import { loadState, portalConfig } from "@/lib/server/portal";

export const metadata: Metadata = { title: "Owner Portal" };
export const dynamic = "force-dynamic";

export default async function Portal({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (!(await isOwner())) redirect("/portal/login");
  const sp = await searchParams;
  const [state, config] = [await loadState(), portalConfig()];
  return <PortalApp mode="live" initial={state} config={config} startNav={{ tab: sp.tab as Tab, lead: sp.lead, quote: sp.quote, job: sp.job }} />;
}
