import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { ShoppingCart, Truck, Star, Search } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_authenticated/materials")({
  head: () => ({ meta: [{ title: "Materials Marketplace — BuildSmart AI" }] }),
  component: Page,
});

const TYPES = ["All", "Cement", "Steel", "Bricks", "Metal", "Paint"];

const STOCK = [
  { type: "Cement", brand: "UltraTech OPC 53", unit: "bag", price: 410, min: 50, days: 1, city: "Pune", rating: 4.8 },
  { type: "Cement", brand: "ACC Gold", unit: "bag", price: 395, min: 100, days: 2, city: "Pune", rating: 4.6 },
  { type: "Steel", brand: "Tata Tiscon Fe550", unit: "kg", price: 68, min: 500, days: 3, city: "Mumbai", rating: 4.9 },
  { type: "Steel", brand: "JSW NeoSteel", unit: "kg", price: 64, min: 1000, days: 4, city: "Pune", rating: 4.7 },
  { type: "Bricks", brand: "Class-A red clay", unit: "pc", price: 9.5, min: 1000, days: 2, city: "Nashik", rating: 4.5 },
  { type: "Bricks", brand: "AAC blocks 600x200x150", unit: "pc", price: 65, min: 200, days: 3, city: "Pune", rating: 4.6 },
  { type: "Metal", brand: "MS angle 50x50x6", unit: "kg", price: 75, min: 100, days: 5, city: "Mumbai", rating: 4.4 },
  { type: "Paint", brand: "Asian Paints Apex 20L", unit: "can", price: 6200, min: 1, days: 1, city: "Pune", rating: 4.8 },
];

function Page() {
  const [t, setT] = useState("All");
  const [q, setQ] = useState("");
  const list = useMemo(() => STOCK.filter((m) =>
    (t === "All" || m.type === t) &&
    (!q || m.brand.toLowerCase().includes(q.toLowerCase()) || m.city.toLowerCase().includes(q.toLowerCase()))
  ), [t, q]);

  return (
    <MobileShell title="Materials B2B">
      <div className="bg-secondary px-5 py-5 text-secondary-foreground">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search brand or city"
            className="w-full rounded-lg bg-white/10 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {TYPES.map((x) => (
            <button
              key={x}
              onClick={() => setT(x)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${t === x ? "bg-primary text-primary-foreground" : "bg-white/10 text-white"}`}
            >{x}</button>
          ))}
        </div>
      </div>

      <ul className="space-y-3 px-5 py-5">
        {list.map((m) => (
          <li key={m.brand} className="rounded-xl border-2 border-foreground/10 bg-card p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-primary">{m.type}</div>
                <div className="text-sm font-bold">{m.brand}</div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5 text-amber-600"><Star className="h-3 w-3 fill-current" />{m.rating}</span>
                  <span><Truck className="mr-0.5 inline h-3 w-3" />{m.days}d · {m.city}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black">₹{m.price}</div>
                <div className="text-[10px] uppercase text-muted-foreground">per {m.unit}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">MOQ {m.min} {m.unit}</span>
              <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">
                <ShoppingCart className="h-3.5 w-3.5" /> Order now
              </button>
            </div>
          </li>
        ))}
      </ul>
    </MobileShell>
  );
}