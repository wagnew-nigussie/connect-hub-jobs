import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { FileText, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { jobTypeLabel, STATUS_STYLES } from "@/lib/jobs";

export const Route = createFileRoute("/jobs/$id")({
  head: () => ({
    meta: [
      { title: "Job details — Connect Hub Jobs" },
      { name: "description", content: "View the role, requirements and apply with your CV." },
      { property: "og:title", content: "Job details — Connect Hub Jobs" },
      { property: "og:description", content: "View the role, requirements and apply with your CV." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JobDetail,
});

function JobDetail() {
  const { id } = Route.useParams();
  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="p-12 text-center text-muted-foreground">Loading…</div>;
  if (!job) return <div className="p-12 text-center text-muted-foreground">Job not found. <Link to="/jobs" className="text-primary underline">Back to jobs</Link></div>;

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[2fr_1fr]">
      <article>
        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">{jobTypeLabel(job.job_type)}</span>
        <h1 className="mt-3 text-3xl font-bold">{job.title}</h1>
        <p className="mt-1 text-muted-foreground">{job.company}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
          <span>{job.category}</span>
          {job.salary_range && <span>{job.salary_range}</span>}
        </div>
        <h2 className="mt-8 text-lg font-semibold">Description</h2>
        <p className="mt-2 whitespace-pre-line">{job.description}</p>
        {job.requirements && (<>
          <h2 className="mt-6 text-lg font-semibold">Requirements</h2>
          <p className="mt-2 whitespace-pre-line">{job.requirements}</p>
        </>)}
      </article>
      <aside className="h-fit rounded-xl border bg-card p-6 shadow-card"><ApplyBox jobId={job.id} /></aside>
    </main>
  );
}

function ApplyBox({ jobId }: { jobId: string }) {
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
      const { data } = await supabase.from("applications").select("status").eq("job_id", jobId).eq("seeker_id", uid!).maybeSingle();
      return data;
    },
  });

  if (loading) return null;
  if (!session) return (<>
    <h2 className="font-semibold">Interested?</h2>
    <p className="mt-1 text-sm text-muted-foreground">Sign in as a job seeker to apply.</p>
    <Button asChild className="mt-4 w-full"><Link to="/auth">Sign in to apply</Link></Button>
  </>);
  if (role !== "seeker") return <p className="text-sm text-muted-foreground">Only job seeker accounts can apply.</p>;
  if (existing) return (<>
    <h2 className="font-semibold">You've applied</h2>
    <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[existing.status]}`}>{existing.status}</span>
    <Button asChild variant="outline" className="mt-4 w-full"><Link to="/dashboard">Track in dashboard</Link></Button>
  </>);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !uid) { toast.error("Please choose your CV file"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("CV must be under 10 MB"); return; }
    setBusy(true);
    const ext = file.name.split(".").pop() ?? "pdf";
    const path = `${uid}/${jobId}-${Date.now()}.${ext}`;
    const up = await supabase.storage.from("cvs").upload(path, file);
    if (up.error) { setBusy(false); toast.error(up.error.message); return; }
    const { error } = await supabase.from("applications").insert({ job_id: jobId, seeker_id: uid, cv_path: path, cover_letter: cover || null });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Application sent!");
    qc.invalidateQueries({ queryKey: ["my-application"] });
    qc.invalidateQueries({ queryKey: ["my-applications"] });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="font-semibold">Apply for this job</h2>
      <div className="space-y-1.5">
        <Label htmlFor="cv">CV (PDF or Word, max 10 MB)</Label>
        <Input id="cv" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        {file && (
          <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate">{file.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </span>
            <button type="button" aria-label="Remove file" className="text-muted-foreground hover:text-destructive" onClick={() => { setFile(null); const input = document.getElementById("cv") as HTMLInputElement | null; if (input) input.value = ""; }}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cover">Cover letter (optional)</Label>
        <Textarea id="cover" rows={5} value={cover} onChange={(e) => setCover(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Sending…" : "Submit application"}</Button>
    </form>
  );
}
