import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Bookmark,
  ArrowRight,
  MapPin,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_STYLES, SAMPLE_JOBS, jobTypeLabel } from "@/lib/jobs";
import { useSavedJobs } from "@/hooks/use-saved-jobs";

export function SeekerDashboard({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const { savedJobIds, toggleSaveJob } = useSavedJobs();

  const { data = [], isLoading } = useQuery({
    queryKey: ["my-applications", userId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("applications")
          .select("id, status, cv_path, created_at, job:jobs(id, title, company, location, job_type, salary_range)")
          .eq("seeker_id", userId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
      } catch {
        return [];
      }
    },
  });

  const withdraw = async (id: string, cvPath: string) => {
    if (!confirm("Withdraw this application? Your CV will be deleted and this cannot be undone.")) return;
    try {
      const { error } = await supabase.from("applications").delete().eq("id", id);
      if (error) {
        toast.error(error.message);
        return;
      }
      await supabase.storage.from("cvs").remove([cvPath]);
      toast.success("Application withdrawn successfully");
      qc.invalidateQueries({ queryKey: ["my-applications"] });
      qc.invalidateQueries({ queryKey: ["my-application"] });
    } catch {
      toast.error("Could not withdraw application");
    }
  };

  const pendingCount = data.filter((a) => a.status === "pending").length;
  const shortlistedCount = data.filter((a) => a.status === "shortlisted").length;
  const savedJobsList = SAMPLE_JOBS.filter((j) => savedJobIds.includes(j.id));

  return (
    <div className="space-y-8 mt-6">
      {/* Top Metric Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Submitted</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-foreground">{data.length}</p>
          <p className="text-xs text-muted-foreground">Total applications</p>
        </div>
        <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pending</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">{pendingCount}</p>
          <p className="text-xs text-muted-foreground">Awaiting review</p>
        </div>
        <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Shortlisted</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{shortlistedCount}</p>
          <p className="text-xs text-muted-foreground">Interview stage</p>
        </div>
        <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">Bookmarked</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-primary">{savedJobIds.length}</p>
          <p className="text-xs text-muted-foreground">Saved opportunities</p>
        </div>
      </div>

      {/* Applications Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Active Applications</h2>
            <p className="text-xs text-muted-foreground">Track the status of your submitted CVs</p>
          </div>
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <Link to="/jobs">
              <Briefcase className="h-4 w-4 text-primary" />
              <span>Browse Openings</span>
            </Link>
          </Button>
        </div>

        {isLoading && <p className="text-xs text-muted-foreground py-6 text-center">Loading applications…</p>}

        {!isLoading && data.length === 0 && (
          <div className="rounded-2xl border bg-card p-8 text-center space-y-3">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-sm">No applications submitted yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Find positions that match your skills, upload your CV, and start connecting with top hiring managers.
            </p>
            <Button asChild size="sm">
              <Link to="/jobs">Explore Available Roles</Link>
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {data.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-5 shadow-sm transition hover:border-primary"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {a.job ? (
                    <Link
                      to="/jobs/$id"
                      params={{ id: a.job.id }}
                      className="font-bold text-base hover:text-primary transition-colors"
                    >
                      {a.job.title}
                    </Link>
                  ) : (
                    <span className="font-semibold text-sm">Job posting archived</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>{a.job?.company}</span>
                  <span>•</span>
                  <span>{a.job?.location}</span>
                  <span>•</span>
                  <span>Applied {new Date(a.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize border ${
                    STATUS_STYLES[a.status] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {a.status}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive gap-1"
                  onClick={() => withdraw(a.id, a.cv_path)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="text-xs">Withdraw</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bookmarked / Saved Jobs Section */}
      {savedJobsList.length > 0 && (
        <section className="space-y-4 pt-4 border-t">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Saved Jobs</h2>
            <p className="text-xs text-muted-foreground">Roles you bookmarked for later review</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {savedJobsList.map((job) => (
              <div
                key={job.id}
                className="flex flex-col justify-between rounded-xl border bg-card p-4 shadow-sm hover:border-primary transition"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">{job.company}</p>
                      <Link to="/jobs/$id" params={{ id: job.id }} className="font-bold text-sm hover:text-primary">
                        {job.title}
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSaveJob(job.id, job.title)}
                      className="text-primary hover:text-muted-foreground"
                      aria-label="Remove bookmark"
                    >
                      <Bookmark className="h-4 w-4 fill-primary" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium dark:text-emerald-400">{job.salary_range}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t flex justify-end">
                  <Button asChild size="sm" variant="default" className="gap-1 text-xs h-8">
                    <Link to="/jobs/$id" params={{ id: job.id }}>
                      <span>View & Apply</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
