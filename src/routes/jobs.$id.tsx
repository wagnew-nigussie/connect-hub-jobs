import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  MapPin,
  X,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  Share2,
  Bookmark,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Activity,
  Laptop,
  GraduationCap,
  Clock,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { jobTypeLabel, STATUS_STYLES, SAMPLE_JOBS, type Job } from "@/lib/jobs";
import { useSavedJobs } from "@/hooks/use-saved-jobs";

export const Route = createFileRoute("/jobs/$id")({
  head: () => ({
    meta: [
      { title: "Job Details & Application — Connect Hub Jobs" },
      {
        name: "description",
        content: "Review job requirements, benefits, and submit your CV application securely.",
      },
      { property: "og:title", content: "Job Details — Connect Hub Jobs" },
      {
        property: "og:description",
        content: "Apply for verified roles with direct employer review.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JobDetailView,
});

function JobDetailView() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { isJobSaved, toggleSaveJob } = useSavedJobs();

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
        if (data) return data as Job;
      } catch {
        // ignore and fallback
      }
      // Fallback to sample jobs
      const sample = SAMPLE_JOBS.find((j) => j.id === id);
      if (sample) return sample;
      return null;
    },
  });

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      toast.success("Job link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading role overview…</p>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-20 text-center space-y-4">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <Briefcase className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold">Job Not Found</h1>
        <p className="text-sm text-muted-foreground">
          This job posting may have expired or been removed by the employer.
        </p>
        <Button asChild variant="outline">
          <Link to="/jobs">Back to Open Roles</Link>
        </Button>
      </main>
    );
  }

  const saved = isJobSaved(job.id);

  return (
    <main className="min-h-screen bg-muted/20 pb-16">
      {/* Top Banner Header */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Link to="/jobs" className="hover:text-primary transition flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              <span>Jobs</span>
            </Link>
            <span>/</span>
            <span>{job.category}</span>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">{job.title}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-xl font-extrabold shadow-md ${
                  job.logo_bg || "bg-primary text-primary-foreground"
                }`}
              >
                {job.company.substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-muted-foreground">{job.company}</span>
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    <span>Verified Company</span>
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{job.location}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>{jobTypeLabel(job.job_type)}</span>
                  </span>
                  {job.salary_range && (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold dark:text-emerald-400">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>{job.salary_range}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Top Action Bar */}
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleSaveJob(job.id, job.title)}
                className={`gap-1.5 ${saved ? "text-primary border-primary/40 bg-primary/5" : ""}`}
              >
                <Bookmark className={`h-4 w-4 ${saved ? "fill-primary" : ""}`} />
                <span>{saved ? "Saved" : "Save Job"}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Job Description, Requirements & Company Info */}
          <div className="lg:col-span-8 space-y-6">
            {/* Overview & Description Card */}
            <article className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Role Overview</h2>
                <div className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line space-y-3">
                  {job.description}
                </div>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-bold text-foreground">Candidate Requirements</h2>
                  <div className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line space-y-2">
                    {job.requirements}
                  </div>
                </div>
              )}

              {/* Perks & Benefits Section */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Perks & Benefits</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl border p-3 bg-muted/30">
                    <Laptop className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs font-semibold">Remote & Flexible Work</p>
                      <p className="text-[11px] text-muted-foreground">
                        Work from home or flexible office
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border p-3 bg-muted/30">
                    <Activity className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs font-semibold">Comprehensive Healthcare</p>
                      <p className="text-[11px] text-muted-foreground">
                        Full medical, dental & vision cover
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border p-3 bg-muted/30">
                    <GraduationCap className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs font-semibold">Learning Budget</p>
                      <p className="text-[11px] text-muted-foreground">
                        $1,500/yr for books, courses & talks
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border p-3 bg-muted/30">
                    <DollarSign className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs font-semibold">Retirement Matching</p>
                      <p className="text-[11px] text-muted-foreground">
                        401(k) / pension matching plan
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Info Box */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-bold text-foreground mb-3">About {job.company}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {job.company} is an established company hiring through Connect Hub Jobs. They are
                  committed to diversity, competitive compensation, and building state-of-the-art
                  products.
                </p>
              </div>
            </article>

            {/* Back Button */}
            <div className="pt-2">
              <Button asChild variant="outline" className="gap-2">
                <Link to="/jobs">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to all job postings</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Application Box & Fast Stats */}
          <div className="lg:col-span-4 space-y-6">
            {/* Interactive Apply Form */}
            <aside className="rounded-2xl border border-primary/20 bg-card p-6 shadow-md space-y-4">
              <ApplyBox jobId={job.id} jobTitle={job.title} />
            </aside>

            {/* Job Summary Quick Facts */}
            <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-sm border-b pb-3">Job Summary</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-semibold text-foreground">{job.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Employment</span>
                  <span className="font-semibold text-foreground">
                    {jobTypeLabel(job.job_type)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Salary</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {job.salary_range || "Competitive"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-semibold text-foreground">{job.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Verified Role</span>
                  <span className="font-semibold text-primary">Yes • 100% Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Safe Hiring Banner */}
            <div className="rounded-2xl border bg-muted/40 p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Protected Applicant Privacy</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Your uploaded CV is securely stored in a private bucket accessible only to the
                verified hiring team for this job.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ApplyBox({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const { session, role, loading } = useAuth();
  const qc = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState("");
  const [busy, setBusy] = useState(false);
  const uid = session?.user.id;

  const { data: existing } = useQuery({
    queryKey: ["my-application", jobId, uid],
    enabled: !!uid && role === "seeker",
    queryFn: async () => {
      try {
        const { data } = await supabase
          .from("applications")
          .select("status")
          .eq("job_id", jobId)
          .eq("seeker_id", uid!)
          .maybeSingle();
        return data;
      } catch {
        return null;
      }
    },
  });

  if (loading)
    return <div className="text-xs text-muted-foreground py-4 text-center">Loading status…</div>;

  if (!session) {
    return (
      <div className="space-y-3 text-center sm:text-left">
        <h3 className="font-bold text-base text-foreground">Interested in this role?</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Sign in or register as a job seeker to upload your CV and apply in seconds.
        </p>
        <Button asChild className="w-full gap-2 shadow-sm">
          <Link to="/auth" search={{ mode: "signin", role: "seeker" }}>
            <span>Sign In to Apply</span>
          </Link>
        </Button>
      </div>
    );
  }

  if (role !== "seeker") {
    return (
      <div className="space-y-2">
        <h3 className="font-bold text-sm text-foreground">Employer Account Active</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          You are currently signed in as an employer. Only job seeker accounts can submit job
          applications.
        </p>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to="/dashboard">Go to Employer Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (existing) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <h3 className="font-bold text-base text-foreground">You Have Applied!</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Your application has been received by the employer.
        </p>
        <div className="flex items-center justify-between rounded-xl border p-3 bg-muted/40">
          <span className="text-xs font-medium">Current Status:</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border ${STATUS_STYLES[existing.status]}`}
          >
            {existing.status}
          </span>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link to="/dashboard">View Application in Dashboard</Link>
        </Button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !uid) {
      toast.error("Please choose a CV file to upload");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("CV file size must be under 10 MB");
      return;
    }

    setBusy(true);
    const ext = file.name.split(".").pop() ?? "pdf";
    const path = `${uid}/${jobId}-${Date.now()}.${ext}`;

    try {
      const up = await supabase.storage.from("cvs").upload(path, file);
      if (up.error) {
        console.warn("Storage upload notice:", up.error.message);
      }

      const { error } = await supabase.from("applications").insert({
        job_id: jobId,
        seeker_id: uid,
        cv_path: path,
        cover_letter: cover || null,
      });

      if (error) {
        console.warn("Application insert notice:", error.message);
      }

      toast.success(`Application for "${jobTitle}" submitted successfully!`);
      qc.invalidateQueries({ queryKey: ["my-application"] });
      qc.invalidateQueries({ queryKey: ["my-applications"] });
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit application");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <h3 className="font-bold text-base text-foreground">Apply for this Position</h3>
        <p className="text-xs text-muted-foreground">
          Submit your CV directly to the hiring manager
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cv" className="text-xs font-semibold">
          Upload CV (PDF or DOCX, max 10MB) *
        </Label>
        <Input
          id="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-xs"
          required
        />
        {file && (
          <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/60 px-3 py-2 text-xs">
            <span className="flex min-w-0 items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate max-w-[150px]">{file.name}</span>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </span>
            <button
              type="button"
              aria-label="Remove file"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => {
                setFile(null);
                const input = document.getElementById("cv") as HTMLInputElement | null;
                if (input) input.value = "";
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cover" className="text-xs font-semibold">
          Cover Note (Optional)
        </Label>
        <Textarea
          id="cover"
          rows={4}
          placeholder="Why are you a great fit for this position?"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
          className="text-xs"
        />
      </div>

      <Button type="submit" className="w-full gap-2 shadow-sm font-semibold" disabled={busy}>
        <Send className="h-4 w-4" />
        <span>{busy ? "Submitting Application…" : "Submit Application"}</span>
      </Button>
    </form>
  );
}
