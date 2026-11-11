"use client";
import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Camera, Check, Globe, Loader2, MapPin, MessageSquareText, Phone, Plus } from "lucide-react";
import { smsLink, telLink } from "@/lib/portal/sweep";
import { uid, type Job, type JobPhoto } from "@/lib/portal/types";
import { SITE } from "@/lib/site";
import { usePortal } from "./context";
import { btn, Card, Empty, fmtDay, H, input, StatusPill, todayYmd } from "./ui";

export function Jobs() {
  const { state, nav, go } = usePortal();
  const [adding, setAdding] = useState(false);
  const job = nav.job ? state.jobs.find((j) => j.id === nav.job) : null;
  if (job) return <JobDetail key={job.id} job={job} />;

  const today = todayYmd();
  const upcoming = state.jobs.filter((j) => j.status === "scheduled").sort((a, b) => `${a.date}${a.time ?? ""}`.localeCompare(`${b.date}${b.time ?? ""}`));
  const done = state.jobs.filter((j) => j.status === "done").sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12);
  const byDay = new Map<string, Job[]>();
  upcoming.forEach((j) => byDay.set(j.date, [...(byDay.get(j.date) ?? []), j]));

  return (
    <div>
      <H sub="Your schedule, job photos, and what shows on the website." action={<button className={btn.lime} onClick={() => setAdding((a) => !a)}><Plus size={16} aria-hidden /> Add job</button>}>
        Jobs
      </H>
      {adding && <AddJob onDone={() => setAdding(false)} />}
      {upcoming.length === 0 && done.length === 0 && !adding ? (
        <Empty title="No jobs yet">Mark a quote “Won” and schedule it, or add a job here.</Empty>
      ) : (
        <div className="space-y-8">
          {[...byDay.entries()].map(([day, list]) => (
            <section key={day}>
              <h2 className={`h-display mb-3 text-2xl ${day < today ? "text-red-700" : ""}`}>
                {day === today ? "Today" : day === todayYmd(1) ? "Tomorrow" : fmtDay(day)} {day < today && <span className="text-base">· overdue</span>}
              </h2>
              <ul className="space-y-2">{list.map((j) => <JobRow key={j.id} j={j} onOpen={() => go({ tab: "jobs", job: j.id })} />)}</ul>
            </section>
          ))}
          {done.length > 0 && (
            <section>
              <h2 className="h-display mb-3 text-2xl">Recently done</h2>
              <ul className="space-y-2">{done.map((j) => <JobRow key={j.id} j={j} onOpen={() => go({ tab: "jobs", job: j.id })} />)}</ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function JobRow({ j, onOpen }: { j: Job; onOpen: () => void }) {
  const shown = j.photos.filter((p) => p.public).length;
  return (
    <li>
      <button className="w-full text-left" onClick={onOpen}>
        <Card className="flex flex-wrap items-center gap-3 transition hover:border-lime-500">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[var(--heading)]">{j.time ? `${j.time} · ` : ""}{j.title}</p>
            <p className="truncate text-sm text-[var(--muted)]">{j.customer} · {j.address}</p>
          </div>
          {j.photos.length > 0 && <span className="text-sm text-[var(--muted)]"><Camera size={14} className="inline" aria-hidden /> {j.photos.length}{shown ? ` · ${shown} on site` : ""}</span>}
          <StatusPill status={j.status} />
        </Card>
      </button>
    </li>
  );
}

function AddJob({ onDone }: { onDone: () => void }) {
  const { dispatch, go } = usePortal();
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const j: Job = {
      id: uid(), created_at: new Date().toISOString(), lead_id: null, quote_id: null,
      title: String(f.get("title") || "Yard work"), customer: String(f.get("customer")), phone: String(f.get("phone") || "") || null,
      address: String(f.get("address")), date: String(f.get("date")), time: String(f.get("time") || "") || null,
      status: "scheduled", notes: null, photos: [],
    };
    if (await dispatch({ op: "job.create", job: j })) { onDone(); go({ tab: "jobs", job: j.id }); }
  };
  return (
    <Card className="mb-6">
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
        {[
          ["customer", "Customer name", "text", true],
          ["phone", "Phone", "tel", false],
          ["address", "Address", "text", true],
          ["title", "What's the job?", "text", true],
        ].map(([n, l, t, r]) => (
          <label key={n as string} className="text-sm">
            <span className="mb-1 block font-semibold">{l}</span>
            <input name={n as string} type={t as string} required={r as boolean} className={input} />
          </label>
        ))}
        <label className="text-sm"><span className="mb-1 block font-semibold">Date</span><input name="date" type="date" required defaultValue={todayYmd(1)} className={input} /></label>
        <label className="text-sm"><span className="mb-1 block font-semibold">Time</span><input name="time" placeholder="9:00 AM" className={input} /></label>
        <div className="flex gap-2 sm:col-span-2">
          <button className={btn.lime}>Save job</button>
          <button type="button" className={btn.ghost} onClick={onDone}>Cancel</button>
        </div>
      </form>
    </Card>
  );
}

function JobDetail({ job }: { job: Job }) {
  const { dispatch, go, upload, photoSrc, toast, mode } = usePortal();
  const [kind, setKind] = useState<JobPhoto["kind"]>("after");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const setPhotos = (photos: JobPhoto[]) => dispatch({ op: "job.update", id: job.id, patch: { photos } });
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`;
  const onWay = `Hi ${job.customer.split(" ")[0]}, ${SITE.name} here. We're on our way to ${job.address} now!`;

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const added: JobPhoto[] = [];
    for (const f of Array.from(files).slice(0, 10)) {
      const r = await upload(f);
      if (r) added.push({ ...r, kind, public: false });
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
    if (added.length) { await setPhotos([...job.photos, ...added]); toast(`${added.length} photo${added.length > 1 ? "s" : ""} added`); }
  };

  return (
    <div className="space-y-5">
      <button onClick={() => go({ tab: "jobs" })} className="min-h-11 inline-flex items-center gap-1 text-sm font-semibold text-[var(--link)]"><ArrowLeft size={16} aria-hidden /> All jobs</button>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="h-display text-4xl md:text-5xl">{job.title}</h1>
          <p className="mt-1 text-[var(--muted)]">{job.customer} · {fmtDay(job.date)}{job.time ? ` at ${job.time}` : ""}</p>
        </div>
        <StatusPill status={job.status} />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {job.phone && <a className={btn.ghost} href={telLink(job.phone)}><Phone size={16} aria-hidden /> Call</a>}
        {job.phone && <a className={btn.blue} href={smsLink(job.phone, onWay)}><MessageSquareText size={16} aria-hidden /> On my way</a>}
        <a className={btn.ghost} href={maps} target="_blank" rel="noopener noreferrer"><MapPin size={16} aria-hidden /> Directions</a>
        {job.status !== "done" ? (
          <button className={btn.lime} onClick={() => dispatch({ op: "job.update", id: job.id, patch: { status: "done", completed_at: new Date().toISOString() } })} data-tour="job-done">
            <Check size={16} aria-hidden /> Mark done
          </button>
        ) : (
          <button className={btn.ghost} onClick={() => dispatch({ op: "job.update", id: job.id, patch: { status: "scheduled", completed_at: null } })}>Undo done</button>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <h2 className="mb-3 font-head text-xl font-bold uppercase">Details</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm"><span className="mb-1 block font-semibold">Date</span>
              <input type="date" className={input} value={job.date} onChange={(e) => e.target.value && dispatch({ op: "job.update", id: job.id, patch: { date: e.target.value } })} />
            </label>
            <label className="text-sm"><span className="mb-1 block font-semibold">Time</span>
              <input className={input} defaultValue={job.time ?? ""} onBlur={(e) => e.target.value !== (job.time ?? "") && dispatch({ op: "job.update", id: job.id, patch: { time: e.target.value || null } })} />
            </label>
          </div>
          <p className="mt-3 text-sm"><b>Address:</b> {job.address}</p>
          <label className="mt-3 block text-sm"><span className="mb-1 block font-semibold">Crew notes</span>
            <textarea rows={4} className={`${input} py-2`} defaultValue={job.notes ?? ""} onBlur={(e) => e.target.value !== (job.notes ?? "") && dispatch({ op: "job.update", id: job.id, patch: { notes: e.target.value || null } })} />
          </label>
          {job.status === "scheduled" && (
            <button className={`${btn.ghost} mt-3`} onClick={() => dispatch({ op: "job.update", id: job.id, patch: { status: "canceled" } })}>Cancel job</button>
          )}
        </Card>

        <Card data-tour="job-photos">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-head text-xl font-bold uppercase">Photos</h2>
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor="photo-kind">Photo type</label>
              <select id="photo-kind" className={`${input} w-auto`} value={kind} onChange={(e) => setKind(e.target.value as JobPhoto["kind"])}>
                <option value="before">Before</option><option value="after">After</option><option value="other">Other</option>
              </select>
              <label className={`${btn.lime} cursor-pointer`}>
                {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Camera size={16} aria-hidden />} Add
                <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} />
              </label>
            </div>
          </div>
          {job.photos.length ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {job.photos.map((p, i) => (
                <li key={p.key} className="overflow-hidden rounded-xl border border-[var(--border)]">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element -- private, auth-gated photos */}
                    <img src={photoSrc(p.key)} alt={`${p.kind} photo`} className="aspect-square w-full object-cover" />
                    <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-bold uppercase text-white">{p.kind}{mode === "demo" ? " · sample" : ""}</span>
                  </div>
                  <label className="flex min-h-11 cursor-pointer items-center gap-2 px-3 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-lime-500"
                      checked={p.public}
                      onChange={() => setPhotos(job.photos.map((x, j) => (j === i ? { ...x, public: !x.public } : x)))}
                    />
                    <Globe size={14} aria-hidden /> Show on website
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="No photos yet">Snap a before and an after. Tick “Show on website” and they appear in the gallery.</Empty>
          )}
          <p className="mt-3 text-xs text-[var(--muted)]">
            {mode === "demo" ? "Demo: photos stay in this browser tab." : "Only photos you tick appear on the public site. A before + after pair becomes a slider."}
          </p>
        </Card>
      </div>
    </div>
  );
}
