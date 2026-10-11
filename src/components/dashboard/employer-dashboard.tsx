import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, JOB_TYPES, STATUS_STYLES, type AppStatus, type Job, type JobType } from "@/lib/jobs";

type JobForm = { title: string; company: string; category: string; location: string; job_type: JobType; salary_range: string; description: string; requirements: string };

export function EmployerDashboard({ userId, companyName }: { userId: string; companyName: string }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Job | "new" | null>(null);
  const [viewing, setViewing] = useState<Job | null>(null);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["my-jobs", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*, applications(count)").eq("employer_id", userId).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const remove = async (id: string) => {
    if (!confirm("Delete this job? Its applications will also be removed.")) return;
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Job deleted");
    qc.invalidateQueries({ queryKey: ["my-jobs"] });
  };

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My job postings</h2>
        <Button onClick={() => setEditing("new")}>Post a job</Button>
      </div>
      <div className="mt-4 space-y-3">
        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        {!isLoading && jobs.length === 0 && <p className="rounded-xl border bg-card p-8 text-center text-muted-foreground">No jobs posted yet.</p>}
        {jobs.map((j) => (
          <div key={j.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-5 shadow-card">
            <div>
              <Link to="/jobs/$id" params={{ id: j.id }} className="font-semibold hover:text-primary">{j.title}</Link>
              <p className="text-sm text-muted-foreground">{j.location} · {j.category} · {j.applications[0]?.count ?? 0} applicants</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setViewing(j)}>Applicants</Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(j)}>Edit</Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(j.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
      {editing && <JobDialog job={editing === "new" ? null : editing} userId={userId} companyName={companyName} onClose={() => setEditing(null)} />}
      {viewing && <ApplicantsDialog job={viewing} onClose={() => setViewing(null)} />}
    </section>
  );
}

function JobDialog({ job, userId, companyName, onClose }: { job: Job | null; userId: string; companyName: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState<JobForm>({
    title: job?.title ?? "", company: job?.company ?? companyName, category: job?.category ?? CATEGORIES[0],
    location: job?.location ?? "", job_type: job?.job_type ?? "full_time", salary_range: job?.salary_range ?? "",
    description: job?.description ?? "", requirements: job?.requirements ?? "",
  });
  const set = (k: keyof JobForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim() || !f.company.trim() || !f.location.trim() || !f.description.trim()) return toast.error("Please fill in all required fields");
    setBusy(true);
    const payload = { ...f, salary_range: f.salary_range || null, requirements: f.requirements || null };
    const { error } = job
      ? await supabase.from("jobs").update(payload).eq("id", job.id)
      : await supabase.from("jobs").insert({ ...payload, employer_id: userId });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(job ? "Job updated" : "Job posted");
    qc.invalidateQueries({ queryKey: ["my-jobs"] });
    qc.invalidateQueries({ queryKey: ["jobs"] });
    qc.invalidateQueries({ queryKey: ["job"] });
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle>{job ? "Edit job" : "Post a job"}</DialogTitle></DialogHeader>
        <form onSubmit={save} className="space-y-3">
          <div className="space-y-1.5"><Label htmlFor="title">Job title *</Label><Input id="title" value={f.title} onChange={set("title")} maxLength={150} /></div>
          <div className="space-y-1.5"><Label htmlFor="company">Company *</Label><Input id="company" value={f.company} onChange={set("company")} maxLength={150} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Category</Label>
              <Select value={f.category} onValueChange={(v) => setF({ ...f, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Job type</Label>
              <Select value={f.job_type} onValueChange={(v) => setF({ ...f, job_type: v as JobType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{JOB_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label htmlFor="location">Location *</Label><Input id="location" value={f.location} onChange={set("location")} maxLength={150} /></div>
            <div className="space-y-1.5"><Label htmlFor="salary">Salary range</Label><Input id="salary" value={f.salary_range} onChange={set("salary_range")} maxLength={100} /></div>
          </div>
          <div className="space-y-1.5"><Label htmlFor="desc">Description *</Label><Textarea id="desc" rows={5} value={f.description} onChange={set("description")} /></div>
          <div className="space-y-1.5"><Label htmlFor="req">Requirements</Label><Textarea id="req" rows={4} value={f.requirements} onChange={set("requirements")} /></div>
          <Button type="submit" className="w-full" disabled={busy}>{busy ? "Saving…" : job ? "Save changes" : "Publish job"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ApplicantsDialog({ job, onClose }: { job: Job; onClose: () => void }) {
  const qc = useQueryClient();
  const key = ["applicants", job.id];
  const { data = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("applications")
        .select("id, status, cv_path, cover_letter, created_at, seeker:profiles(full_name)")
        .eq("job_id", job.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const openCv = async (path: string) => {
    const { data, error } = await supabase.storage.from("cvs").createSignedUrl(path, 60);
    if (error || !data) return toast.error("Could not open CV");
    window.open(data.signedUrl, "_blank", "noopener");
  };

  const setStatus = async (id: string, status: AppStatus) => {
    const { error } = await supabase.from("applications").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked as ${status}`);
    qc.invalidateQueries({ queryKey: key });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader><DialogTitle>Applicants — {job.title}</DialogTitle></DialogHeader>
        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        {!isLoading && data.length === 0 && <p className="text-muted-foreground">No applicants yet.</p>}
        <div className="space-y-3">
          {data.map((a) => (
            <div key={a.id} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{a.seeker?.full_name || "Applicant"}</p>
                  <p className="text-xs text-muted-foreground">Applied {new Date(a.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[a.status]}`}>{a.status}</span>
              </div>
              {a.cover_letter && <p className="mt-3 whitespace-pre-line text-sm">{a.cover_letter}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => openCv(a.cv_path)}>View CV</Button>
                <Select value={a.status} onValueChange={(v) => setStatus(a.id, v as AppStatus)}>
                  <SelectTrigger className="h-9 w-40" aria-label="Status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
