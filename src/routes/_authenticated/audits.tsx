import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { ClipboardCheck, ShieldCheck, HardHat, FileWarning } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/audits")({
  head: () => ({ meta: [{ title: "Audits — BuildSmart AI" }] }),
  component: Page,
});

const TEMPLATES = [
  { cat: "Safety", icon: HardHat, items: ["Hard hats in use", "Scaffolding inspected", "First-aid kit on site", "Fire extinguisher present", "PPE issued to all workers"] },
  { cat: "Structural", icon: ShieldCheck, items: ["Rebar spacing verified", "Concrete cover ≥ 25mm", "No visible cracks", "Slab levelness ±5mm", "Column verticality ±10mm"] },
  { cat: "Compliance", icon: FileWarning, items: ["Building permit on display", "Boundary setback OK", "Noise hours respected", "Waste disposal logged", "Worker insurance valid"] },
];

function Page() {
  const [active, setActive] = useState(0);
  const tpl = TEMPLATES[active];
  const [state, setState] = useState<Record<string, "pass" | "fail" | undefined>>({});
  const [saving, setSaving] = useState(false);

  const score = Object.values(state).filter((v) => v === "pass").length;
  const total = tpl.items.length;

  return (
    <MobileShell title="Audit Platform">
      <div className="bg-secondary px-5 py-5 text-secondary-foreground">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="h-6 w-6 text-accent" />
          <div>
            <h2 className="text-lg font-black leading-tight">Run a site audit</h2>
            <p className="text-xs opacity-80">Pre-built checklists for safety, structure & compliance.</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {TEMPLATES.map((t, i) => {
            const Icon = t.icon;
            return (
              <button
                key={t.cat}
                onClick={() => { setActive(i); setState({}); }}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold ${
                  active === i ? "bg-primary text-primary-foreground" : "bg-white/10 text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {t.cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-black">{tpl.cat} checklist</h3>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-accent px-2 py-1 text-[11px] font-black text-accent-foreground">
              {score}/{total}
            </span>
            <button
              disabled={saving || Object.keys(state).length === 0}
              onClick={async () => {
                setSaving(true);
                try {
                  const { data: u } = await supabase.auth.getUser();
                  if (!u.user) throw new Error("Not signed in");
                  const { data: audit, error: e1 } = await supabase.from("audits").insert({
                    user_id: u.user.id,
                    title: `${tpl.cat} Audit - ${new Date().toLocaleDateString()}`,
                    category: tpl.cat,
                    score
                  }).select("id").single();
                  if (e1 || !audit) throw e1 || new Error("Insert failed");
                  
                  const items = Object.entries(state).map(([label, status]) => ({
                    audit_id: audit.id,
                    label,
                    status: status || "pending"
                  }));
                  const { error: e2 } = await supabase.from("audit_items").insert(items);
                  if (e2) throw e2;
                  toast.success("Audit saved to database!");
                  setState({});
                } catch (err) {
                  toast.error("Failed to save audit");
                } finally {
                  setSaving(false);
                }
              }}
              className="rounded-md bg-primary px-3 py-1 text-xs font-bold text-primary-foreground disabled:opacity-50"
            >
              {saving ? "Saving..." : "Submit Audit"}
            </button>
          </div>
        </div>
        <ul className="space-y-2">
          {tpl.items.map((item) => (
            <li key={item} className="flex items-center justify-between rounded-xl border-2 border-foreground/10 bg-card p-3">
              <span className="text-sm">{item}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setState((s) => ({ ...s, [item]: "pass" }))}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${state[item] === "pass" ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}
                >PASS</button>
                <button
                  onClick={() => setState((s) => ({ ...s, [item]: "fail" }))}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${state[item] === "fail" ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground"}`}
                >FAIL</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </MobileShell>
  );
}