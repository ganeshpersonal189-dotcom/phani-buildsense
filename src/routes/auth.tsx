import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — BuildSmart AI" }] }),
  component: AuthPage,
});

type Role = "contractor" | "owner" | "laborer" | "supplier";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<Role>("contractor");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/home", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName }, emailRedirectTo: window.location.origin + "/home" },
        });
        if (error) throw error;
        if (data.user) {
          await supabase.from("user_roles").insert({ user_id: data.user.id, role });
        }
        toast.success("Account created");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/home", replace: true });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + "/home",
    },
  });

  if (error) {
    toast.error(error.message);
  }
}

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <div className="border-b-2 border-foreground/10 bg-secondary px-5 py-4 text-secondary-foreground">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary font-black text-primary-foreground">B</div>
          <span className="text-base font-black tracking-tight">BuildSmart AI</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 py-8">
        <h1 className="text-2xl font-black tracking-tight">{mode === "signup" ? "Create account" : "Welcome back"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signup" ? "Build smarter from day one." : "Sign in to your site."}
        </p>

        <button
          onClick={google}
          className="mt-6 flex items-center justify-center gap-2 rounded-lg border-2 border-foreground/15 bg-card px-4 py-3 text-sm font-bold"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9c-.3 1.4-1 2.6-2.2 3.4v2.8h3.6c2.1-2 3.2-4.8 3.2-8.2z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8C4.1 20.5 7.8 23 12 23z"/><path fill="#FBBC05" d="M6 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.9H2.3C1.5 8.4 1 10.2 1 12s.5 3.6 1.3 5.1L6 14.3z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1C17.4 2.1 14.9 1 12 1 7.8 1 4.1 3.5 2.3 6.9L6 9.7C6.9 7.2 9.2 5.4 12 5.4z"/></svg>
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          {mode === "signup" && (
            <>
              <label className="text-xs font-bold uppercase tracking-wide">Name</label>
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="rounded-lg border-2 border-foreground/15 bg-card px-3 py-2.5 text-base" />
              <label className="text-xs font-bold uppercase tracking-wide">I am a</label>
              <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="rounded-lg border-2 border-foreground/15 bg-card px-3 py-2.5 text-base">
                <option value="contractor">Contractor</option>
                <option value="owner">Building Owner</option>
                <option value="laborer">Laborer</option>
                <option value="supplier">Material Supplier</option>
              </select>
            </>
          )}
          <label className="text-xs font-bold uppercase tracking-wide">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-lg border-2 border-foreground/15 bg-card px-3 py-2.5 text-base" />
          <label className="text-xs font-bold uppercase tracking-wide">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="rounded-lg border-2 border-foreground/15 bg-card px-3 py-2.5 text-base" />

          <button disabled={busy} type="submit" className="mt-2 rounded-lg bg-primary px-4 py-3 text-base font-bold text-primary-foreground disabled:opacity-60">
            {busy ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account? Sign in" : "No account yet? Create one"}
        </button>
      </div>
    </div>
  );
}