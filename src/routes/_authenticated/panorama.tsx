import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Compass, Plus, MapPin } from "lucide-react";

export const Route = createFileRoute("/_authenticated/panorama")({
  head: () => ({ meta: [{ title: "Instant 360 — BuildSmart AI" }] }),
  component: Page,
});

const ROOMS = [
  { name: "Foundation — East wing", date: "Jun 12", progress: 80 },
  { name: "Ground floor slab", date: "Jun 10", progress: 60 },
  { name: "Boundary wall — North", date: "Jun 09", progress: 100 },
  { name: "Stairwell shaft", date: "Jun 07", progress: 35 },
];

function Page() {
  return (
    <MobileShell title="Instant 360">
      <div className="bg-secondary px-5 py-5 text-secondary-foreground">
        <div className="flex items-start gap-3">
          <Compass className="h-6 w-6 text-accent" />
          <div>
            <h2 className="text-lg font-black leading-tight">Walk the site, virtually</h2>
            <p className="mt-1 text-xs opacity-80">
              Stitch 360° panoramas from any phone — drag to look around, swipe to move.
            </p>
          </div>
        </div>
        <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">
          <Plus className="h-4 w-4" /> Capture new panorama
        </button>
      </div>

      <div className="px-5 py-5">
        <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-muted-foreground">Recent walkthroughs</h3>
        <ul className="space-y-3">
          {ROOMS.map((r) => (
            <li key={r.name} className="overflow-hidden rounded-xl border-2 border-foreground/10 bg-card">
              <div className="relative h-32 bg-gradient-to-br from-secondary via-secondary/70 to-primary/30">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Compass className="h-10 w-10 text-white/40" />
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold">{r.name}</div>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground"><MapPin className="mr-0.5 inline h-3 w-3" />{r.date}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${r.progress}%` }} />
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase text-muted-foreground">{r.progress}% complete</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </MobileShell>
  );
}