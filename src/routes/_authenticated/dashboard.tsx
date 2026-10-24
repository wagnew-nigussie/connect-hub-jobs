import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Building2, UserRound, ArrowLeft, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { SeekerDashboard } from "@/components/dashboard/seeker-dashboard";
import { EmployerDashboard } from "@/components/dashboard/employer-dashboard";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Connect Hub Jobs" },
      {
        name: "description",
        content: "Manage your Connect Hub Jobs applications or employer job postings.",
      },
      { property: "og:title", content: "Dashboard — Connect Hub Jobs" },
      {
        property: "og:description",
        content: "Manage your Connect Hub Jobs applications or employer job postings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { session, role, loading } = useAuth();

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading your workspace…</p>
      </main>
    );
  }

  const isEmployer = role === "employer";
  const userName =
    session?.user.user_metadata?.["full_name"] || session?.user.email?.split("@")[0] || "User";
  const companyName = String(session?.user.user_metadata?.["company_name"] ?? "");

  return (
    <main className="min-h-screen bg-muted/20 pb-16">
      {/* Dashboard Top Header */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-primary to-blue-600 text-primary-foreground font-bold text-lg shadow-md shadow-primary/25">
                {userName.substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1 text-xs">
                    {isEmployer ? (
                      <>
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        <span>Employer Account</span>
                      </>
                    ) : (
                      <>
                        <UserRound className="h-3.5 w-3.5 text-primary" />
                        <span>Candidate Seeker</span>
                      </>
                    )}
                  </Badge>
                  {companyName && (
                    <span className="text-xs font-semibold text-muted-foreground">
                      • {companyName}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Welcome back, {userName}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {isEmployer
                    ? "Manage your company job postings and review submitted CV applications."
                    : "Manage your submitted applications, bookmarked roles, and career progress."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link to="/jobs">
                  <Briefcase className="h-4 w-4" />
                  <span>Browse Jobs</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {session &&
          (isEmployer ? (
            <EmployerDashboard userId={session.user.id} companyName={companyName} />
          ) : (
            <SeekerDashboard userId={session.user.id} />
          ))}
      </div>
    </main>
  );
}
