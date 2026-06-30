import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/diagnostics")({
  head: () => ({ meta: [{ title: "AI Crack Diagnostics — BuildSmart AI" }] }),
  component: Page,
});

import { MobileShell } from "@/components/MobileShell";
import { useRef, useState } from "react";
import { Camera, Upload, Loader2, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { analyzeCrack } from "@/lib/buildsmart-ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Result = {
  crack_type: string;
  severity: string;
  length_mm: number;
  width_mm: number;
  depth_mm: number;
  diagnosis: string;
  repair_solution: string;
};

const SEV: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-900 border-emerald-300",
  moderate: "bg-amber-100 text-amber-900 border-amber-300",
  high: "bg-orange-200 text-orange-900 border-orange-400",
  critical: "bg-red-200 text-red-900 border-red-500",
};

function Page() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const run = useServerFn(analyzeCrack);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      setResult(null);
      setBusy(true);
      try {
        const r = (await run({ data: { imageDataUrl: dataUrl } })) as Result;
        setResult(r);

        // persist (best-effort)
        const { data: u } = await supabase.auth.getUser();
        if (u.user) {
          await supabase.from("crack_scans").insert({
            user_id: u.user.id,
            crack_type: r.crack_type,
            severity: r.severity,
            length_mm: r.length_mm,
            width_mm: r.width_mm,
            depth_mm: r.depth_mm,
            diagnosis: r.diagnosis,
            repair_solution: r.repair_solution,
            raw_ai: r,
          });
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Analysis failed");
      } finally {
        setBusy(false);
      }
    };
    reader.readAsDataURL(f);
  }

  function reset() {
    setPreview(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <MobileShell title="AI Crack Diagnostics">
      <div className="px-5 py-5">
        {!preview && (
          <div className="rounded-2xl border-2 border-dashed border-foreground/20 bg-card p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Camera className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-black">Scan a crack</h2>
            <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
              Take a clear photo — include a coin or ruler in frame for accurate measurement.
            </p>
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
            >
              <Upload className="h-4 w-4" /> Capture / upload photo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onFile}
              className="hidden"
            />
          </div>
        )}

        {preview && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border-2 border-foreground/10 bg-secondary">
              <img src={preview} alt="Crack" className="h-64 w-full object-cover" />
            </div>

            {busy && (
              <div className="flex items-center gap-3 rounded-xl border-2 border-foreground/10 bg-card p-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                  <div className="text-sm font-bold">Analyzing structural integrity…</div>
                  <div className="text-xs text-muted-foreground">AI vision model + structural ruleset</div>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border-2 border-foreground/15 bg-card px-3 py-1.5 text-xs font-black uppercase">
                    {result.crack_type} crack
                  </span>
                  <span className={`rounded-md border-2 px-3 py-1.5 text-xs font-black uppercase ${SEV[result.severity] ?? SEV.low}`}>
                    {result.severity === "critical" || result.severity === "high" ? (
                      <AlertTriangle className="mr-1 inline h-3.5 w-3.5" />
                    ) : (
                      <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
                    )}
                    {result.severity}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Measure label="Length" value={`${result.length_mm.toFixed(1)} mm`} />
                  <Measure label="Width" value={`${result.width_mm.toFixed(2)} mm`} />
                  <Measure label="Depth" value={`${result.depth_mm.toFixed(1)} mm`} />
                </div>

                <div className="rounded-xl border-2 border-foreground/10 bg-card p-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Diagnosis</div>
                  <p className="mt-1 text-sm leading-relaxed">{result.diagnosis}</p>
                </div>

                <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary">Engineering-approved repair</div>
                  <p className="mt-1 text-sm leading-relaxed">{result.repair_solution}</p>
                </div>
              </div>
            )}

            <button onClick={reset} className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-foreground/15 bg-card px-4 py-3 text-sm font-bold">
              <RefreshCw className="h-4 w-4" /> Scan another
            </button>
          </div>
        )}
      </div>
    </MobileShell>
  );
}

function Measure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border-2 border-foreground/10 bg-card p-3 text-center">
      <div className="text-base font-black">{value}</div>
      <div className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}