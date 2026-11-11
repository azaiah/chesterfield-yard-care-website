"use client";
import { createContext, useContext } from "react";
import type { JobPhoto, Op, PortalConfig, PortalState } from "@/lib/portal/types";

export type Tab = "today" | "leads" | "quotes" | "jobs" | "sweep" | "prices" | "settings";
export type Nav = { tab: Tab; lead?: string | null; quote?: string | null; job?: string | null };

export type PortalCtx = {
  mode: "live" | "demo";
  state: PortalState;
  config: PortalConfig;
  dispatch: (op: Op) => Promise<boolean>;
  upload: (file: File) => Promise<Omit<JobPhoto, "kind" | "public"> | null>;
  photoSrc: (key: string) => string;
  nav: Nav;
  go: (n: Nav) => void;
  toast: (msg: string) => void;
};

export const Ctx = createContext<PortalCtx | null>(null);
export function usePortal() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePortal outside PortalApp");
  return c;
}
