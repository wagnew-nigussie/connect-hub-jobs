import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_STYLES } from "@/lib/jobs";

export function SeekerDashboard({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["my-applications", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("id, status, cv_path, created_at, job:jobs(id, title, company, location)")
        .eq("seeker_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const withdraw = async (id: string, cvPath: string) => {
    if (!confirm("Withdraw this application? Your CV will be deleted and this cannot be undone.")) return;
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    await supabase.storage.from("cvs").remove([cvPath]);
    toast.success("Application withdrawn");
    qc.invalidateQueries({ queryKey: ["my-applications"] });
    qc.invalidateQueries({ queryKey: ["my-application"] });
  };

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My applications</h2>
        <Button asChild variant="outline"><Link to="/jobs">Find jobs</Link></Button>
      </div>
      <div className="mt-4 space-y-3">
        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        {!isLoading && data.length === 0 && <p className="rounded-xl border bg-card p-8 text-center text-muted-foreground">You haven't applied to any jobs yet.</p>}
        {data.map((a) => (
          <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-5 shadow-card">
            <div>
              {a.job ? <Link to="/jobs/$id" params={{ id: a.job.id }} className="font-semibold hover:text-primary">{a.job.title}</Link> : <span className="font-semibold">Job removed</span>}
              <p className="text-sm text-muted-foreground">{a.job?.company} · {a.job?.location} · Applied {new Date(a.created_at).toLocaleDateString()}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[a.status]}`}>{a.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
