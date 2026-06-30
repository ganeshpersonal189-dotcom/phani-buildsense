import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Phone, Star, MapPin, Search, HardHat } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_authenticated/labor")({
  head: () => ({ meta: [{ title: "Labor Marketplace — BuildSmart AI" }] }),
  component: Page,
});

const SAMPLE = [
  { name: "Ramesh K.", skill: "Mason", rate: 850, city: "Pune", years: 8, rating: 4.8, available: true },
  { name: "Sunita D.", skill: "Helper", rate: 500, city: "Pune", years: 3, rating: 4.6, available: true },
  { name: "Mohan S.", skill: "Electrician", rate: 1200, city: "Mumbai", years: 12, rating: 4.9, available: false },
  { name: "Anil P.", skill: "Plumber", rate: 1000, city: "Pune", years: 6, rating: 4.5, available: true },
  { name: "Vijay R.", skill: "Bar bender", rate: 900, city: "Nashik", years: 9, rating: 4.7, available: true },
  { name: "Geeta M.", skill: "Painter", rate: 700, city: "Pune", years: 4, rating: 4.4, available: true },
];

const SKILLS = ["All", "Mason", "Helper", "Electrician", "Plumber", "Bar bender", "Painter"];

function Page() {
  const [skill, setSkill] = useState("All");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    return SAMPLE.filter((l) =>
      (skill === "All" || l.skill === skill) &&
      (!q || l.name.toLowerCase().includes(q.toLowerCase()) || l.city.toLowerCase().includes(q.toLowerCase()))
    );
  }, [skill, q]);

  return (
    <MobileShell title="Labor Marketplace">
      <div className="bg-secondary px-5 py-5 text-secondary-foreground">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or city"
            className="w-full rounded-lg bg-white/10 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {SKILLS.map((s) => (
            <button
              key={s}
              onClick={() => setSkill(s)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                skill === s ? "bg-primary text-primary-foreground" : "bg-white/10 text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-3 px-5 py-5">
        {list.map((l) => (
          <li key={l.name} className="flex items-center gap-3 rounded-xl border-2 border-foreground/10 bg-card p-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <HardHat className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="truncate text-sm font-bold">{l.name}</div>
                {!l.available && <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase text-muted-foreground">Busy</span>}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {l.skill} · {l.years}y exp · <MapPin className="inline h-3 w-3" />{l.city}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs">
                <span className="flex items-center gap-0.5 text-amber-600"><Star className="h-3 w-3 fill-current" />{l.rating}</span>
                <span className="font-black">₹{l.rate}/day</span>
              </div>
            </div>
            <button
              disabled={!l.available}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground disabled:opacity-50"
            >
              <Phone className="h-3.5 w-3.5" /> Call
            </button>
          </li>
        ))}
      </ul>
    </MobileShell>
  );
}