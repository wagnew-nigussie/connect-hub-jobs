import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Browse jobs — HireWave" },
      { name: "description", content: "Search open roles by category and location." },
      { property: "og:title", content: "Browse jobs — HireWave" },
      { property: "og:description", content: "Search open roles by category and location." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Jobs</h1>
      <p className="mt-2 text-muted-foreground">Job listings, search and filters are coming in the next step.</p>
    </main>
  );
}
