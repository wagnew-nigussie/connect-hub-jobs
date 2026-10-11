import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, FileUp, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HireWave — Find your next job or your next hire" },
      { name: "description", content: "Browse jobs, apply with your CV, and track every application. Employers post roles and manage applicants in one place." },
      { property: "og:title", content: "HireWave — Find your next job or your next hire" },
      { property: "og:description", content: "Browse jobs, apply with your CV, and track every application." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Search, title: "Search & filter", text: "Find roles by keyword, category and location.", to: "/jobs" as const },
  { icon: FileUp, title: "Apply with your CV", text: "Upload once per application, securely stored.", to: "/jobs" as const },
  { icon: BarChart3, title: "Track status", text: "See if you're pending, shortlisted or rejected.", to: "/dashboard" as const },
  { icon: Users, title: "Manage applicants", text: "Employers review CVs and update statuses.", to: "/auth" as const, search: { mode: "signup", role: "employer" } as const },
];

function Index() {
  return (
    <main>
      <section className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <h1 className="max-w-3xl text-4xl font-bold sm:text-6xl">The simpler way to get hired.</h1>
          <p className="mt-5 max-w-xl text-lg opacity-90">
            Job seekers find and apply in minutes. Employers post roles and shortlist the right people.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary"><Link to="/jobs">Browse jobs</Link></Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/auth" search={{ mode: "signup", role: "employer" }}>Post a job</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <Link
            key={f.title}
            to={f.to}
            search={"search" in f ? f.search : undefined}
            className="group rounded-xl border bg-card p-6 shadow-card transition hover:border-primary hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <f.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-semibold group-hover:text-primary">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
