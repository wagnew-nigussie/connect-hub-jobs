import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  SlidersHorizontal,
  Bookmark,
  Building2,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  Mail,
  TrendingUp,
  Star,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  CATEGORIES,
  JOB_TYPES,
  EXPERIENCE_LEVELS,
  FEATURED_COMPANIES,
  SAMPLE_JOBS,
  jobTypeLabel,
  type Job,
  type JobType,
} from "@/lib/jobs";
import { useSavedJobs } from "@/hooks/use-saved-jobs";

type SearchParams = {
  q?: string;
  category?: string;
  location?: string;
  type?: string;
  experience?: string;
};

export const Route = createFileRoute("/jobs/")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    location: typeof search["location"] === "string" ? search["location"] : undefined,
    type: typeof search["type"] === "string" ? search["type"] : undefined,
    experience: typeof search["experience"] === "string" ? search["experience"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Browse Jobs & Tech Careers — Connect Hub Jobs" },
      {
        name: "description",
        content:
          "Discover verified open roles across top technology organizations. Search by keyword, category, and salary.",
      },
      { property: "og:title", content: "Explore Tech Jobs — Connect Hub Jobs" },
      {
        property: "og:description",
        content:
          "Browse verified jobs, apply directly with your CV, and track your hiring pipeline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JobsExplorePage,
});

function JobsExplorePage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();
  const { isJobSaved, toggleSaveJob } = useSavedJobs();

  // Local filter states
  const [q, setQ] = useState(searchParams.q ?? "");
  const [category, setCategory] = useState(searchParams.category ?? "all");
  const [location, setLocation] = useState(searchParams.location ?? "");
  const [selectedType, setSelectedType] = useState<string>(searchParams.type ?? "all");
  const [selectedExp, setSelectedExp] = useState<string>(searchParams.experience ?? "all");
  const [sortBy, setSortBy] = useState<"newest" | "title">("newest");
  const [alertEmail, setAlertEmail] = useState("");

  // Query jobs from Supabase
  const { data: remoteJobs = [], isLoading } = useQuery({
    queryKey: ["jobs", q, category, location, selectedType],
    queryFn: async () => {
      try {
        let query = supabase.from("jobs").select("*").order("created_at", { ascending: false });
        const clean = (s: string) => s.replace(/[%,()]/g, " ").trim();
        if (clean(q)) {
          query = query.or(
            `title.ilike.%${clean(q)}%,company.ilike.%${clean(q)}%,description.ilike.%${clean(q)}%`,
          );
        }
        if (category !== "all") query = query.eq("category", category);
        if (selectedType !== "all") query = query.eq("job_type", selectedType as JobType);
        if (clean(location)) query = query.ilike("location", `%${clean(location)}%`);
        const { data, error } = await query;
        if (error) {
          console.warn("Supabase query fallback to sample jobs:", error.message);
          return [];
        }
        return data || [];
      } catch (err) {
        console.warn("Supabase connection fallback:", err);
        return [];
      }
    },
  });

  // Combine remote jobs with sample jobs if remote is empty or filter sample jobs directly
  const allJobs = useMemo(() => {
    let list: Job[] = remoteJobs.length > 0 ? remoteJobs : SAMPLE_JOBS;

    // Apply client-side filters if fallback sample jobs are being used
    if (remoteJobs.length === 0) {
      if (q.trim()) {
        const queryLower = q.toLowerCase();
        list = list.filter(
          (j) =>
            j.title.toLowerCase().includes(queryLower) ||
            j.company.toLowerCase().includes(queryLower) ||
            j.description.toLowerCase().includes(queryLower) ||
            j.tags?.some((t) => t.toLowerCase().includes(queryLower)),
        );
      }
      if (category !== "all") {
        list = list.filter((j) => j.category === category);
      }
      if (selectedType !== "all") {
        list = list.filter((j) => j.job_type === selectedType);
      }
      if (location.trim()) {
        const locLower = location.toLowerCase();
        list = list.filter((j) => j.location.toLowerCase().includes(locLower));
      }
    }

    // Filter by experience if selected
    if (selectedExp !== "all") {
      list = list.filter((j) => (j as Job & { experience?: string }).experience === selectedExp);
    }

    // Sort
    return [...list].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [remoteJobs, q, category, selectedType, location, selectedExp, sortBy]);

  const handleResetFilters = () => {
    setQ("");
    setCategory("all");
    setLocation("");
    setSelectedType("all");
    setSelectedExp("all");
    navigate({ to: "/jobs", search: {} });
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail || !alertEmail.includes("@")) {
      toast.error("Please provide a valid email");
      return;
    }
    toast.success("Job alert created! You'll receive matching positions.");
    setAlertEmail("");
  };

  return (
    <main className="min-h-screen bg-muted/20">
      {/* Top Banner */}
      <div className="border-b bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Explore Verified Opportunities</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Browse Available Roles
            </h1>
            <p className="text-sm text-muted-foreground">
              Filter by specialty, contract type, and salary range. Apply directly with your private
              CV.
            </p>
          </div>
        </div>
      </div>

      {/* THREE-COLUMN LAYOUT: Left Sidebar, Main Feed, Right Sidebar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* ================= LEFT SIDEBAR (FILTERS) ================= */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  <span>Filter Roles</span>
                </div>
                {(q ||
                  category !== "all" ||
                  selectedType !== "all" ||
                  location ||
                  selectedExp !== "all") && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Keyword Search */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Keywords
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g. React, Engineer"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>

              {/* Location Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="City or Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>

              {/* Employment Type */}
              <div className="space-y-2 border-t pt-4">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Job Type
                </label>
                <div className="space-y-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedType("all")}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                      selectedType === "all"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <span>All Types</span>
                  </button>
                  {JOB_TYPES.map((jt) => (
                    <button
                      key={jt.value}
                      type="button"
                      onClick={() => setSelectedType(jt.value)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                        selectedType === jt.value
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <span>{jt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2 border-t pt-4">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Department
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Filter */}
              <div className="space-y-2 border-t pt-4">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Experience Level
                </label>
                <div className="space-y-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedExp("all")}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                      selectedExp === "all"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <span>All Levels</span>
                  </button>
                  {EXPERIENCE_LEVELS.map((exp) => (
                    <button
                      key={exp.value}
                      type="button"
                      onClick={() => setSelectedExp(exp.value)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                        selectedExp === exp.value
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <span>{exp.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ================= MAIN CONTENT FEED ================= */}
          <section className="lg:col-span-6 space-y-4">
            {/* Header Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-sm">
              <div>
                <p className="text-sm font-bold text-foreground">
                  Showing <span className="text-primary">{allJobs.length}</span> open opportunities
                </p>
                <p className="text-xs text-muted-foreground">Updated in real time</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Sort:</span>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as "newest" | "title")}>
                  <SelectTrigger className="h-8 w-32 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="title">Job Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="mt-3">Loading open positions…</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && allJobs.length === 0 && (
              <div className="rounded-2xl border bg-card p-12 text-center space-y-3">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-base">No jobs matched your filters</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Try clearing your search terms or expanding your department criteria.
                </p>
                <Button size="sm" onClick={handleResetFilters} variant="outline">
                  Reset Search Filters
                </Button>
              </div>
            )}

            {/* Job Cards List */}
            <div className="space-y-3">
              {allJobs.map((job) => {
                const saved = isJobSaved(job.id);
                return (
                  <div
                    key={job.id}
                    className="group relative rounded-2xl border bg-card p-5 shadow-sm transition hover:border-primary hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl font-bold text-sm shadow-sm ${
                            job.logo_bg || "bg-primary text-primary-foreground"
                          }`}
                        >
                          {job.company.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-muted-foreground">
                              {job.company}
                            </span>
                            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <Link
                            to="/jobs/$id"
                            params={{ id: job.id }}
                            className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mt-0.5"
                          >
                            {job.title}
                          </Link>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSaveJob(job.id, job.title)}
                        className={`rounded-lg border p-2 transition hover:bg-muted ${
                          saved
                            ? "text-primary border-primary/40 bg-primary/10"
                            : "text-muted-foreground"
                        }`}
                        aria-label="Save this job"
                      >
                        <Bookmark className={`h-4 w-4 ${saved ? "fill-primary" : ""}`} />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <Badge variant="secondary" className="gap-1 font-medium">
                        <Briefcase className="h-3 w-3" />
                        <span>{jobTypeLabel(job.job_type)}</span>
                      </Badge>
                      <Badge variant="outline" className="gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                      </Badge>
                      {job.salary_range && (
                        <Badge
                          variant="outline"
                          className="text-emerald-600 border-emerald-500/20 bg-emerald-500/5 font-semibold"
                        >
                          {job.salary_range}
                        </Badge>
                      )}
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {job.tags && job.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {job.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Recent Opening</span>
                      </span>
                      <Button asChild size="sm" className="gap-1">
                        <Link to="/jobs/$id" params={{ id: job.id }}>
                          <span>Apply Role</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ================= RIGHT SIDEBAR ================= */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Featured Employers Card */}
            <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b pb-3">
                <Building2 className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm">Top Companies Hiring</h3>
              </div>
              <div className="space-y-3">
                {FEATURED_COMPANIES.map((comp) => (
                  <div
                    key={comp.name}
                    className="flex items-center justify-between gap-2 rounded-xl p-2.5 transition hover:bg-muted/60"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`grid h-8 w-8 place-items-center rounded-lg text-xs font-bold shrink-0 ${comp.logoBg}`}
                      >
                        {comp.name.substring(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-foreground truncate">
                          {comp.name}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                          <span>{comp.rating}</span>
                          <span>• {comp.openJobsCount} roles</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs px-2"
                      onClick={() => {
                        setQ(comp.name);
                        navigate({ to: "/jobs", search: { q: comp.name } });
                      }}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Job Alert Subscription Card */}
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-5 shadow-sm space-y-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Mail className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm">Create Job Alert</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Receive instant emails when new jobs matching your title or skills are posted.
              </p>
              <form onSubmit={handleCreateAlert} className="space-y-2 pt-1">
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  className="h-8 text-xs bg-background"
                  required
                />
                <Button type="submit" size="sm" className="w-full text-xs">
                  Subscribe to Alerts
                </Button>
              </form>
            </div>

            {/* In-Demand Trending Skills */}
            <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b pb-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm">Trending Skills</h3>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  "React",
                  "TypeScript",
                  "Python",
                  "Node.js",
                  "Next.js",
                  "AI & LLMs",
                  "PostgreSQL",
                  "AWS",
                  "Docker",
                  "Figma",
                  "Kubernetes",
                ].map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      setQ(skill);
                      navigate({ to: "/jobs", search: { q: skill } });
                    }}
                    className="rounded-md border bg-muted/50 px-2 py-1 text-[11px] font-medium text-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Career Tip Card */}
            <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-primary">
                Pro Tip for Seekers
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tailoring your CV keywords to the specific requirements of a job posting increases
                applicant interview rates by over 60%.
              </p>
              <Link
                to="/workflow"
                className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline pt-1"
              >
                <span>Read Platform Workflow</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
