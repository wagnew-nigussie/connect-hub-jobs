import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Building2,
  Users,
  Code2,
  Palette,
  BrainCircuit,
  Megaphone,
  ShieldCheck,
  Star,
  DollarSign,
  Globe,
  Clock,
  Bookmark,
} from "lucide-react";
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
import { CATEGORIES, SAMPLE_JOBS, jobTypeLabel } from "@/lib/jobs";
import { useSavedJobs } from "@/hooks/use-saved-jobs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Connect Hub Jobs — Find Your Next Career Opportunity" },
      {
        name: "description",
        content:
          "Connect Hub Jobs connects top tech talent with innovative companies. Search verified jobs, apply directly with your CV, and track applications in real time.",
      },
      { property: "og:title", content: "Connect Hub Jobs — Career & Hiring Platform" },
      {
        property: "og:description",
        content: "Discover verified high-paying roles across software engineering, product, design, and AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IndexPage,
});

const CATEGORY_CARDS = [
  { name: "Engineering", count: "1,420+ roles", icon: Code2, color: "text-blue-500 bg-blue-500/10" },
  { name: "Design", count: "850+ roles", icon: Palette, color: "text-purple-500 bg-purple-500/10" },
  { name: "AI & Data Science", count: "640+ roles", icon: BrainCircuit, color: "text-emerald-500 bg-emerald-500/10" },
  { name: "Product", count: "510+ roles", icon: Sparkles, color: "text-amber-500 bg-amber-500/10" },
  { name: "Marketing", count: "430+ roles", icon: Megaphone, color: "text-pink-500 bg-pink-500/10" },
  { name: "Finance", count: "320+ roles", icon: TrendingUp, color: "text-cyan-500 bg-cyan-500/10" },
];

const TRUST_METRICS = [
  { value: "45,000+", label: "Active Job Seekers", icon: Users },
  { value: "3,200+", label: "Verified Employers", icon: Building2 },
  { value: "98%", label: "Application Response Rate", icon: CheckCircle2 },
  { value: "$135k", label: "Average Tech Salary", icon: DollarSign },
];

const TESTIMONIALS = [
  {
    quote:
      "I applied to Stripe through Connect Hub Jobs and received a response within 48 hours. The direct CV upload and real-time dashboard made the entire hiring journey seamless.",
    name: "Abebe Bekele",
    role: "Senior Full-Stack Engineer at Stripe",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
  {
    quote:
      "As a startup founder, hiring qualified engineers used to take months. Connect Hub Jobs gave us direct access to verified developers with zero agency fluff.",
    name: "Sarah Jenkins",
    role: "Co-Founder & VP of Product at CloudScale",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
  {
    quote:
      "The salary transparency and remote-first filter options are genuinely the best I have used. I landed a lead UI/UX design position while working remotely.",
    name: "Elena Vance",
    role: "Lead Product Designer at Vercel",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
];

function IndexPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("");
  const { isJobSaved, toggleSaveJob } = useSavedJobs();

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/jobs",
      search: {
        ...(keyword ? { q: keyword } : {}),
        ...(category !== "all" ? { category } : {}),
        ...(location ? { location } : {}),
      },
    });
  };

  return (
    <main className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/10 via-background to-background py-16 sm:py-24">
        {/* Background glow circle */}
        <div className="absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>The Premier Career & Hiring Hub</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
                Find Your Dream Role. <br className="hidden sm:inline" />
                <span className="text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Build What Matters.
                </span>
              </h1>

              <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground lg:mx-0">
                Connect Hub Jobs bridges the gap between ambitious professionals and world-class companies.
                Explore verified openings, apply with a single CV upload, and track every application live.
              </p>

              {/* SEARCH BOX */}
              <form
                onSubmit={handleHeroSearch}
                className="rounded-2xl border bg-card p-3 shadow-xl sm:p-4 grid gap-2.5 sm:grid-cols-12"
              >
                <div className="relative sm:col-span-5">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Job title, keyword, or company"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="pl-10 h-11 border-muted bg-background/70"
                  />
                </div>

                <div className="sm:col-span-4">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-11 border-muted bg-background/70">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-3">
                  <Button type="submit" size="lg" className="h-11 w-full gap-2 shadow-md shadow-primary/20">
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </Button>
                </div>
              </form>

              {/* Quick tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Popular Searches:</span>
                {["Remote", "React", "Senior", "Node.js", "Design", "Python"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setKeyword(tag);
                      navigate({ to: "/jobs", search: { q: tag } });
                    }}
                    className="rounded-md border bg-card px-2.5 py-1 text-xs font-medium transition hover:border-primary hover:text-primary"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Graphic / Interactive Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Photo */}
                <div className="overflow-hidden rounded-3xl border bg-card shadow-2xl transition hover:shadow-primary/10">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
                    alt="Professionals collaborating in modern tech office"
                    className="h-72 w-full object-cover sm:h-80"
                    loading="lazy"
                  />
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground font-bold">
                          CH
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">Verified Hiring Pipeline</h4>
                          <p className="text-xs text-muted-foreground">Direct connection to decision makers</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="gap-1 text-xs bg-emerald-500/10 text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        Live
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Floating Top Badge */}
                <div className="absolute -left-4 -top-4 rounded-xl border bg-card/95 p-3.5 shadow-lg backdrop-blur-md hidden sm:flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/15 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Application Shortlisted 🎉</p>
                    <p className="text-[11px] text-muted-foreground">Stripe · Senior Full-Stack</p>
                  </div>
                </div>

                {/* Floating Bottom Badge */}
                <div className="absolute -bottom-4 -right-4 rounded-xl border bg-card/95 p-3.5 shadow-lg backdrop-blur-md hidden sm:flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">$145k - $185k Salary</p>
                    <p className="text-[11px] text-muted-foreground">Verified Offer Range</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PARTNER BRANDS TICKER */}
          <div className="mt-16 border-t pt-8">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Empowering top talent from leading organizations
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all">
              <span className="font-display font-bold text-lg sm:text-xl text-foreground">STRIPE</span>
              <span className="font-display font-bold text-lg sm:text-xl text-foreground">VERCEL</span>
              <span className="font-display font-bold text-lg sm:text-xl text-foreground">SHOPIFY</span>
              <span className="font-display font-bold text-lg sm:text-xl text-foreground">CLOUDFLARE</span>
              <span className="font-display font-bold text-lg sm:text-xl text-foreground">GITHUB</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST METRICS STATS */}
      <section className="border-b bg-card py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {TRUST_METRICS.map((item) => (
              <div key={item.label} className="text-center space-y-1.5">
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">{item.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="py-16 sm:py-20 border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Explore by Category</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Find curated opportunities tailored to your specialized domain
              </p>
            </div>
            <Button asChild variant="outline" className="gap-1.5">
              <Link to="/jobs">
                <span>View All Openings</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_CARDS.map((cat) => (
              <Link
                key={cat.name}
                to="/jobs"
                search={{ category: cat.name }}
                className="group relative flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm transition hover:border-primary hover:shadow-md hover:-translate-y-0.5"
              >
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${cat.color}`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{cat.count}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS SECTION */}
      <section className="py-16 sm:py-20 bg-muted/30 border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="text-primary border-primary/30">
              Handpicked Roles
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">Featured Job Openings</h2>
            <p className="text-sm text-muted-foreground">
              High-impact roles from fast-growing startups and industry-leading technology giants
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {SAMPLE_JOBS.slice(0, 4).map((job) => {
              const saved = isJobSaved(job.id);
              return (
                <div
                  key={job.id}
                  className="group relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition hover:border-primary hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid h-12 w-12 place-items-center rounded-xl font-bold text-sm shadow-sm ${
                            job.logo_bg || "bg-primary text-primary-foreground"
                          }`}
                        >
                          {job.company.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground">{job.company}</p>
                          <Link
                            to="/jobs/$id"
                            params={{ id: job.id }}
                            className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1"
                          >
                            {job.title}
                          </Link>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSaveJob(job.id, job.title)}
                        className={`rounded-lg border p-2 transition hover:bg-muted ${
                          saved ? "text-primary border-primary/40 bg-primary/10" : "text-muted-foreground"
                        }`}
                        aria-label="Save job"
                      >
                        <Bookmark className={`h-4 w-4 ${saved ? "fill-primary" : ""}`} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="secondary" className="gap-1">
                        <Briefcase className="h-3 w-3" />
                        <span>{jobTypeLabel(job.job_type)}</span>
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{job.location}</span>
                      </Badge>
                      {job.salary_range && (
                        <Badge variant="outline" className="text-emerald-600 border-emerald-500/20 bg-emerald-500/5">
                          {job.salary_range}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Posted recently</span>
                    </span>
                    <Button asChild size="sm" variant="default" className="gap-1">
                      <Link to="/jobs/$id" params={{ id: job.id }}>
                        <span>View Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg" className="gap-2 shadow-md">
              <Link to="/jobs">
                <span>Explore All Available Positions</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CANDIDATE SUCCESS TESTIMONIALS */}
      <section className="py-16 sm:py-24 border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <Badge variant="outline" className="text-primary border-primary/30">
              Community Stories
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">Loved by Seekers & Employers</h2>
            <p className="text-sm text-muted-foreground">
              Hear from professionals who accelerated their career through Connect Hub Jobs
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="space-y-4">
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm italic text-muted-foreground leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t pt-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover border"
                  />
                  <div>
                    <h4 className="font-semibold text-xs text-foreground">{t.name}</h4>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DUAL ACTION CTA BANNER */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary to-blue-700 text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 items-center">
            <div className="space-y-4 text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to take the next step in your career?
              </h2>
              <p className="text-sm sm:text-base opacity-90 max-w-md">
                Create your candidate account in under 2 minutes. Upload your CV and apply to top companies today.
              </p>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start pt-2">
                <Button asChild size="lg" variant="secondary" className="gap-2 shadow-lg font-semibold">
                  <Link to="/auth" search={{ mode: "signup", role: "seeker" }}>
                    <span>Register as Job Seeker</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-transparent text-white hover:bg-white/10"
                >
                  <Link to="/auth" search={{ mode: "signup", role: "employer" }}>
                    Post a Role as Employer
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
                <span className="text-sm font-medium">Free CV upload with secure private storage</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
                <span className="text-sm font-medium">Direct employer review without third-party delays</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
                <span className="text-sm font-medium">Live candidate dashboard tracking application statuses</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
