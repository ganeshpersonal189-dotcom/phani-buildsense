import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Plus, FileText, Camera, TrendingUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({ meta: [{ title: "Live Progress — BuildSmart AI" }] }),
  component: Page,
});

type Log = { date: string; labor: number; material: number; other: number; note: string };

const SEED: Log[] = [
  { date: "Jun 14", labor: 18400, material: 22100, other: 1500, note: "Slab pour for first floor — 12 m³" },
  { date: "Jun 13", labor: 16200, material: 8500,  other: 800,  note: "Shuttering & rebar tying" },
  { date: "Jun 12", labor: 17800, material: 35400, other: 2200, note: "Cement & steel delivery + masonry" },
  { date: "Jun 11", labor: 14600, material: 6100,  other: 1100, note: "Brick wall ground floor east" },
];

function Page() {
  const [logs, setLogs] = useState<Log[]>(SEED);
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState<Log>({ date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), labor: 0, material: 0, other: 0, note: "" });

  const total = logs.reduce((s, l) => s + l.labor + l.material + l.other, 0);

  return (
    <MobileShell title="Live Progress">
      <div className="bg-secondary px-5 py-5 text-secondary-foreground">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-accent" />
          <div className="flex-1">
            <div className="text-xs opacity-70 uppercase tracking-widest">Total spend this week</div>
            <div className="text-3xl font-black">₹{total.toLocaleString("en-IN")}</div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => setShow((s) => !s)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">
            <Plus className="h-3.5 w-3.5" /> Log today
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold">
            <FileText className="h-3.5 w-3.5" /> Owner PDF
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold">
            <Camera className="h-3.5 w-3.5" /> Upload photos
          </button>
        </div>
      </div>

      {show && (
        <div className="border-b-2 border-foreground/10 bg-accent/30 px-5 py-4">
          <div className="grid grid-cols-3 gap-2">
            <NumIn label="Labor ₹" value={draft.labor} onChange={(v) => setDraft({ ...draft, labor: v })} />
            <NumIn label="Material ₹" value={draft.material} onChange={(v) => setDraft({ ...draft, material: v })} />
            <NumIn label="Other ₹" value={draft.other} onChange={(v) => setDraft({ ...draft, other: v })} />
          </div>
          <input
            value={draft.note}
            onChange={(e) => setDraft({ ...draft, note: e.target.value })}
            placeholder="Work summary"
            className="mt-2 w-full rounded-lg border-2 border-foreground/15 bg-card px-3 py-2 text-sm"
          />
          <button
            onClick={() => { setLogs([draft, ...logs]); setShow(false); setDraft({ ...draft, labor: 0, material: 0, other: 0, note: "" }); }}
            className="mt-2 w-full rounded-lg bg-primary py-2 text-sm font-bold text-primary-foreground"
          >Save entry</button>
        </div>
      )}

      <ul className="space-y-3 px-5 py-5">
        {logs.map((l, i) => (
          <li key={i} className="rounded-xl border-2 border-foreground/10 bg-card p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-black">{l.date}</div>
              <div className="text-sm font-black">₹{(l.labor + l.material + l.other).toLocaleString("en-IN")}</div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{l.note}</p>
            <div className="mt-2 flex gap-2 text-[10px] font-bold uppercase">
              <span className="rounded bg-secondary px-1.5 py-0.5 text-secondary-foreground">L ₹{l.labor.toLocaleString("en-IN")}</span>
              <span className="rounded bg-primary px-1.5 py-0.5 text-primary-foreground">M ₹{l.material.toLocaleString("en-IN")}</span>
              <span className="rounded bg-accent px-1.5 py-0.5 text-accent-foreground">O ₹{l.other.toLocaleString("en-IN")}</span>
            </div>
          </li>
        ))}
      </ul>
    </MobileShell>
  );
}

function NumIn({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full rounded-lg border-2 border-foreground/15 bg-card px-2 py-1.5 text-sm" />
    </label>
  );
}