"use client";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/portal/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: new FormData(e.currentTarget).get("password") }),
      });
      const j = await r.json();
      if (!j.ok) { setError(j.error ?? "Sign-in failed"); return; }
      location.href = "/portal";
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="pw" className="mb-1.5 block text-sm font-semibold text-white/90">Password</label>
        <input
          id="pw"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-14 w-full rounded-2xl border border-white/25 bg-white/[.07] px-4 text-white outline-none focus:border-electric-500 focus:ring-2 focus:ring-electric-500/40"
          aria-describedby={error ? "pw-err" : undefined}
        />
        {error && <p id="pw-err" role="alert" className="mt-2 text-sm font-semibold text-sun-400">{error}</p>}
      </div>
      <button className="cyc-btn cyc-btn--lime w-full disabled:opacity-70" disabled={busy}>
        {busy && <Loader2 className="animate-spin" aria-hidden />} Sign in
      </button>
    </form>
  );
}
