import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Compass } from "lucide-react";
import { LoginForm } from "@/components/portal/LoginForm";
import { isOwner, portalConfigured } from "@/lib/server/auth";
import { storageMode } from "@/lib/server/db";
import { BRAND } from "@/lib/site";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function Login() {
  if (await isOwner()) redirect("/portal");
  return (
    <main className="band-dark cyc-topo grid min-h-svh place-items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Image src={`${BRAND}/logo/logo-on-navy-tight.svg`} alt="Chesterfield Yard Care" width={280} height={70} className="mx-auto h-16 w-auto" priority />
          <h1 className="h-display mt-6 text-4xl">Owner portal</h1>
          <p className="mt-1 text-[var(--muted)]">Leads, quotes, jobs and your weekly Lead Sweep.</p>
        </div>
        <div className="cyc-frame">
          {storageMode() === "none" ? (
            <p className="text-white/85">The live portal turns on once a database is connected. For now, everything runs in the demo below.</p>
          ) : portalConfigured() ? (
            <LoginForm />
          ) : (
            <p className="text-white/85">Sign-in isn&apos;t set up yet. Add <code>PORTAL_PASSWORD</code> and <code>PORTAL_SESSION_SECRET</code> to the site&apos;s environment.</p>
          )}
        </div>
        <Link
          href="/portal/demo"
          className="group flex items-center gap-4 rounded-3xl border-2 border-dashed border-lime-500/70 bg-white/5 p-5 transition hover:border-lime-500 hover:bg-white/10"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lime-500 text-forest-950"><Compass aria-hidden /></span>
          <span className="flex-1">
            <span className="block font-head text-2xl font-extrabold uppercase text-white">Try the demo portal</span>
            <span className="block text-sm text-white/75">Sample customers and guide cards. No sign-in needed.</span>
          </span>
          <ArrowRight className="text-lime-300 transition group-hover:translate-x-1" aria-hidden />
        </Link>
        <p className="text-center text-sm"><Link className="text-[var(--muted)] underline" href="/">← Back to the website</Link></p>
      </div>
    </main>
  );
}
