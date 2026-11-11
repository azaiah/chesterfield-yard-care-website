// Shared portal types + the pure reducer used by both the live portal (optimistic UI) and the demo.

export type LeadStatus = "new" | "contacted" | "quote_sent" | "won" | "lost";
export const LEAD_STATUSES: { id: LeadStatus; label: string }[] = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "quote_sent", label: "Quote sent" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];
export const LOST_REASONS = ["Price", "Went with someone else", "No response", "Out of area", "Not a fit", "Other"];

export type Lead = {
  id: string;
  created_at: string;
  status: LeadStatus;
  lost_reason?: string | null;
  source: string;
  name: string;
  phone: string;
  address: string;
  email?: string | null;
  services: string[];
  plan?: string | null;
  estimate?: { low?: number; high?: number; size?: string; frequency?: string } | null;
  timing?: string | null;
  notes?: string | null;
  owner_notes?: string | null;
  contact_pref?: string | null;
  photos: string[];
  utm?: { source?: string; medium?: string; campaign?: string; landing?: string; referrer?: string } | null;
  page?: string | null;
  value_estimate?: number | null;
  first_contacted_at?: string | null;
};

export type QuoteItem = { service: string; label: string; price: number };
export type QuoteStatus = "draft" | "sent" | "accepted" | "declined";
export type Quote = {
  id: string;
  lead_id: string;
  created_at: string;
  status: QuoteStatus;
  items: QuoteItem[];
  note?: string | null;
  sent_at?: string | null;
};
export const quoteTotal = (q: Pick<Quote, "items">) => q.items.reduce((a, i) => a + (Number(i.price) || 0), 0);

export type JobPhoto = { key: string; kind: "before" | "after" | "other"; public: boolean; width?: number; height?: number; caption?: string };
export type JobStatus = "scheduled" | "done" | "canceled";
export type Job = {
  id: string;
  lead_id?: string | null;
  quote_id?: string | null;
  created_at: string;
  title: string;
  customer: string;
  phone?: string | null;
  address: string;
  date: string; // YYYY-MM-DD
  time?: string | null;
  status: JobStatus;
  notes?: string | null;
  photos: JobPhoto[];
  completed_at?: string | null;
};

export type PriceBook = Record<string, { low: number; high: number; unit: string }>;

export type PortalState = { leads: Lead[]; quotes: Quote[]; jobs: Job[]; priceBook: PriceBook };

export type PortalConfig = {
  db: "supabase" | "local" | "none" | "demo";
  email: boolean;
  sms: boolean;
  ownerEmail: boolean;
  ownerPhone: boolean;
  turnstile: boolean;
  analytics: boolean;
  cron: boolean;
};

export type Op =
  | { op: "lead.update"; id: string; patch: Partial<Pick<Lead, "status" | "lost_reason" | "owner_notes" | "value_estimate" | "first_contacted_at">> }
  | { op: "quote.create"; quote: Quote }
  | { op: "quote.update"; id: string; patch: Partial<Pick<Quote, "status" | "items" | "note" | "sent_at">> }
  | { op: "job.create"; job: Job }
  | { op: "job.update"; id: string; patch: Partial<Omit<Job, "id" | "created_at">> }
  | { op: "prices.set"; priceBook: PriceBook };

/** Side effects that always follow a change (kept here so live + demo behave the same). */
export function expandOp(state: PortalState, op: Op): Op[] {
  const out: Op[] = [op];
  const now = new Date().toISOString();
  if (op.op === "lead.update" && op.patch.status && op.patch.status !== "new") {
    const l = state.leads.find((x) => x.id === op.id);
    if (l && !l.first_contacted_at && !op.patch.first_contacted_at) out[0] = { ...op, patch: { ...op.patch, first_contacted_at: now } };
  }
  if (op.op === "quote.update" && op.patch.status) {
    const q = state.quotes.find((x) => x.id === op.id);
    const leadStatus = op.patch.status === "sent" ? "quote_sent" : op.patch.status === "accepted" ? "won" : op.patch.status === "declined" ? "lost" : null;
    if (q && leadStatus) {
      const l = state.leads.find((x) => x.id === q.lead_id);
      if (l && l.status !== leadStatus && !(leadStatus === "quote_sent" && (l.status === "won" || l.status === "lost")))
        out.push(...expandOp(state, { op: "lead.update", id: l.id, patch: { status: leadStatus, ...(leadStatus === "lost" ? { lost_reason: "Declined quote" } : {}) } }));
    }
  }
  return out;
}

export function reduce(state: PortalState, op: Op): PortalState {
  switch (op.op) {
    case "lead.update":
      return { ...state, leads: state.leads.map((l) => (l.id === op.id ? { ...l, ...op.patch } : l)) };
    case "quote.create":
      return { ...state, quotes: [op.quote, ...state.quotes] };
    case "quote.update":
      return { ...state, quotes: state.quotes.map((q) => (q.id === op.id ? { ...q, ...op.patch } : q)) };
    case "job.create":
      return { ...state, jobs: [...state.jobs, op.job] };
    case "job.update":
      return { ...state, jobs: state.jobs.map((j) => (j.id === op.id ? { ...j, ...op.patch } : j)) };
    case "prices.set":
      return { ...state, priceBook: op.priceBook };
  }
}

export const applyAll = (state: PortalState, op: Op) => expandOp(state, op).reduce(reduce, state);

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
