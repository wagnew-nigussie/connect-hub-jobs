import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, jobTypeLabel } from "@/lib/jobs";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Browse jobs — HireWave" },
      { name: "description", content: "Search open roles by keyword, category and location." },
      { property: "og:title", content: "Browse jobs — HireWave" },
      { property: "og:description", content: "Search open roles by keyword, category and location." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("");

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs", q, category, location],
    queryFn: async () => {
      let query = supabase.from("jobs").select("*").order("created_at", { ascending: false });
      const clean = (s: string) => s.replace(/[%,()]/g, " ").trim();
      if (clean(q)) query = query.or(`title.ilike.%${clean(q)}%,company.ilike.%${clean(q)}%,description.ilike.%${clean(q)}%`);
      if (category !== "all") query = query.eq("category", category);
      if (clean(location)) query = query.ilike("location", `%${clean(location)}%`);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Jobs</h1>
      <div className="mt-6 grid gap-3 rounded-xl border bg-card p-4 shadow-card sm:grid-cols-[2fr_1fr_1fr]">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Keyword, title or company" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Keyword" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger aria-label="Category"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Location" />
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && <p className="text-muted-foreground">Loading jobs…</p>}
        {!isLoading && jobs.length === 0 && (
          <p className="rounded-xl border bg-card p-8 text-center text-muted-foreground">No jobs match your search yet.</p>
        )}
        {jobs.map((j) => (
          <Link key={j.id} to="/jobs/$id" params={{ id: j.id }} className="block rounded-xl border bg-card p-5 shadow-card transition hover:border-primary">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">{j.title}</h2>
                <p className="text-sm text-muted-foreground">{j.company}</p>
              </div>
              <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">{jobTypeLabel(j.job_type)}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{j.location}</span>
              <span>{j.category}</span>
              {j.salary_range && <span>{j.salary_range}</span>}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
