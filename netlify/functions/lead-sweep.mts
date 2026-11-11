// Netlify Scheduled Function: weekly Lead Sweep email, Mondays 13:00 UTC (8am EST / 9am EDT).
const leadSweep = async () => {
  const base = process.env.URL;
  const secret = process.env.CRON_SECRET;
  if (!base || !secret) return new Response("missing URL or CRON_SECRET", { status: 500 });
  const r = await fetch(`${base}/api/cron/lead-sweep`, { headers: { Authorization: `Bearer ${secret}` } });
  return new Response(await r.text(), { status: r.status });
};

export default leadSweep;
export const config = { schedule: "0 13 * * 1" };
