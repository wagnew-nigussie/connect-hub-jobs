import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { SeekerDashboard } from "@/components/dashboard/seeker-dashboard";
import { EmployerDashboard } from "@/components/dashboard/employer-dashboard";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [
    { title: "Dashboard — HireWave" },
    { name: "description", content: "Manage your HireWave applications or employer job postings." },
    { property: "og:title", content: "Dashboard — HireWave" },
    { property: "og:description", content: "Manage your HireWave applications or employer job postings." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Dashboard,
});

function Dashboard() {
  const { session, role, loading } = useAuth();
  if (loading) return <div className="p-12 text-center text-muted-foreground">Loading…</div>;
  const isEmployer = role === "employer";
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
        {isEmployer ? "Employer" : "Job seeker"}
      </span>
      <h1 className="mt-3 text-3xl font-bold">
        Welcome, {session?.user.user_metadata?.['full_name'] || session?.user.email}
      </h1>
      {session && (isEmployer
        ? <EmployerDashboard userId={session.user.id} companyName={String(session.user.user_metadata?.["company_name"] ?? "")} />
        : <SeekerDashboard userId={session.user.id} />)}
    </main>
  );
}
