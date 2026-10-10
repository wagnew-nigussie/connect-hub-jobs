import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Briefcase, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type Search = { mode?: "signin" | "signup"; role?: AppRole };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    mode: s['mode'] === "signup" ? "signup" : "signin",
    role: s['role'] === "employer" ? "employer" : "seeker",
  }),
  head: () => ({
    meta: [
      { title: "Sign in or register — HireWave" },
      { name: "description", content: "Sign in or create a job seeker or employer account." },
      { property: "og:title", content: "Sign in or register — HireWave" },
      { property: "og:description", content: "Sign in or create a job seeker or employer account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [tab, setTab] = useState(search.mode ?? "signin");
  const [role, setRole] = useState<AppRole>(search.role ?? "seeker");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/dashboard", replace: true });
  }, [session, navigate]);

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(f.get("email")),
      password: String(f.get("password")),
    });
    setBusy(false);
    if (error) toast.error(error.message);
  };

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: String(f.get("email")),
      password: String(f.get("password")),
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
        data: {
          full_name: String(f.get("full_name")),
          company_name: role === "employer" ? String(f.get("company_name") ?? "") : null,
          role,
        },
      },
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (!data.session) toast.success("Check your email to confirm your account.");
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border bg-card p-6 shadow-elevated sm:p-8">
        <h1 className="text-2xl font-bold">Welcome to HireWave</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in or create your account.</p>
        <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")} className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={signIn} className="mt-4 space-y-4">
              <Field label="Email" name="email" type="email" />
              <Field label="Password" name="password" type="password" />
              <Button type="submit" className="w-full" disabled={busy}>Sign in</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={signUp} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {([["seeker", "Job seeker", UserRound], ["employer", "Employer", Briefcase]] as const).map(([r, label, Icon]) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition",
                      role === r ? "border-primary bg-primary-soft text-primary" : "hover:bg-muted",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </button>
                ))}
              </div>
              <Field label="Full name" name="full_name" />
              {role === "employer" && <Field label="Company name" name="company_name" />}
              <Field label="Email" name="email" type="email" />
              <Field label="Password" name="password" type="password" minLength={6} />
              <Button type="submit" className="w-full" disabled={busy}>Create account</Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function Field({ label, name, type = "text", minLength }: { label: string; name: string; type?: string; minLength?: number }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} required minLength={minLength} />
    </div>
  );
}
