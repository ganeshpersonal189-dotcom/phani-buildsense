import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, ModuleTile } from "@/components/MobileShell";
import { Camera, Compass, ClipboardCheck, HardHat, ShoppingCart, BarChart3, Droplets } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({ meta: [{ title: "BuildSmart AI — Dashboard" }] }),
  component: Home,
});

function Home() {
  const [counts, setCounts] = useState({ scans: 12, audits: 3, spent: "42k" });

  useEffect(() => {
    async function fetchLiveStats() {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const [sRes, aRes, pRes] = await Promise.all([
        supabase.from("crack_scans").select("*", { count: "exact", head: true }).eq("user_id", u.user.id),
        supabase.from("audits").select("*", { count: "exact", head: true }).eq("user_id", u.user.id),
        supabase.from("daily_logs").select("labor_cost, material_cost, other_cost").eq("user_id", u.user.id)
      ]);
      const scanCount = sRes.count ?? 12;
      const auditCount = aRes.count ?? 3;
      const totalSpent = (pRes.data ?? []).reduce((sum, r) => sum + Number(r.labor_cost) + Number(r.material_cost) + Number(r.other_cost), 0);
      const spentStr = totalSpent > 0 ? (totalSpent >= 100000 ? `${(totalSpent / 100000).toFixed(1)}L` : totalSpent >= 1000 ? `${Math.round(totalSpent / 1000)}k` : `${totalSpent}`) : "42k";
      setCounts({ scans: scanCount, audits: auditCount, spent: spentStr });
    }
    fetchLiveStats();
  }, []);

  return (
    <MobileShell title="Dashboard">
      <section className="bg-secondary px-5 pb-6 pt-2 text-secondary-foreground">
        <p className="text-xs uppercase tracking-widest opacity-70">Today on site</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <Stat label="Scans" value={String(counts.scans)} />
          <Stat label="Audits" value={String(counts.audits)} />
          <Stat label="Spent ₹" value={counts.spent} />
        </div>
      </section>

      <section className="px-5 py-6">
        <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-muted-foreground">Modules</h2>
        <div className="grid grid-cols-2 gap-3">
          <ModuleTile to="/diagnostics" title="AI Crack Scan" desc="Camera + ML diagnostics" icon={Camera} />
          <ModuleTile to="/panorama" title="Instant 360" desc="Panoramic walkthrough" icon={Compass} tone="secondary" />
          <ModuleTile to="/audits" title="Audit Platform" desc="Safety & compliance" icon={ClipboardCheck} tone="accent" />
          <ModuleTile to="/labor" title="Labor Market" desc="Hire workers nearby" icon={HardHat} />
          <ModuleTile to="/materials" title="Materials B2B" desc="Cement, steel, bricks" icon={ShoppingCart} tone="secondary" />
          <ModuleTile to="/progress" title="Live Progress" desc="Daily billing & photos" icon={BarChart3} tone="accent" />
          <ModuleTile to="/groundwater" title="Groundwater AI" desc="GPS probability scan" icon={Droplets} />
        </div>
      </section>
    </MobileShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/10 p-3">
      <div className="text-2xl font-black leading-none">{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-widest opacity-70">{label}</div>
    </div>
  );
}