import { createFileRoute, Link } from "@tanstack/react-router";
import { HardHat, Camera, BarChart3, Droplets, ShieldCheck, ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BuildSmart AI — Construction Intelligence" },
      { name: "description", content: "AI crack diagnostics, on-demand labor, materials marketplace, and live site transparency for contractors and building owners." },
      { property: "og:title", content: "BuildSmart AI" },
      { property: "og:description", content: "AI-powered construction management for the modern site." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b-2 border-foreground/10 bg-secondary px-5 py-4 text-secondary-foreground">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-primary font-black text-primary-foreground">B</div>
          <span className="text-lg font-black tracking-tight">BuildSmart AI</span>
        </div>
        <Link to="/auth" className="rounded bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          Sign in
        </Link>
      </header>
      <main className="flex-1 px-5 py-10">
        <span className="inline-block rounded bg-accent px-2 py-1 text-[10px] font-black uppercase tracking-widest text-accent-foreground">
          Built for the site
        </span>
        <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight">
          AI crack diagnostics. Labor in one tap. Materials in another.
        </h1>
        <p className="mt-4 max-w-md text-base text-muted-foreground">
          Scan a crack, get an engineering-approved repair plan. Hire skilled
          workers nearby. Compare cement, steel, bricks &amp; paint from suppliers
          near your site. Keep owners updated in real time.
        </p>
        <Link
          to="/auth"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-sm"
        >
          Get started
        </Link>

        <div className="mt-10 grid grid-cols-2 gap-3">
          {[
            { icon: Camera, t: "AI Crack Scan", d: "Wall, beam or column — classified instantly." },
            { icon: HardHat, t: "On-Demand Labor", d: "Bid-priced workers, one-tap hire." },
            { icon: ShoppingCart, t: "Materials B2B", d: "Live pricing on cement, steel, bricks." },
            { icon: BarChart3, t: "Owner Portal", d: "Daily billing &amp; photo updates." },
            { icon: ShieldCheck, t: "Audit Platform", d: "Safety + structural checklists." },
            { icon: Droplets, t: "Groundwater AI", d: "Probability maps from satellite data." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-xl border-2 border-foreground/10 bg-card p-3">
              <Icon className="h-5 w-5 text-primary" />
              <div className="mt-2 text-sm font-bold">{t}</div>
              <div className="mt-1 text-[11px] text-muted-foreground" dangerouslySetInnerHTML={{ __html: d }} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
