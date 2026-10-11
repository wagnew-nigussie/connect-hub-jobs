import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, CheckCircle2, Clock3, FileText, ListChecks, Search, UserRound, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/workflow")({
  head: () => ({
    meta: [
      { title: "Website workflow — HireWave" },
      { name: "description", content: "A step-by-step guide to HireWave's job seeker and employer journeys, with current availability and planned features." },
      { property: "og:title", content: "Website workflow — HireWave" },
      { property: "og:description", content: "Follow registration, job applications, and hiring journeys with clear current and planned steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WorkflowPage,
});

const journeys = {
  seeker: [
    { title: "Create your account", icon: UserRoundPlus, available: true, text: "Choose Job seeker on the registration form. Enter your full name, email, and password." },
    { title: "Sign in and open your dashboard", icon: UserRound, available: true, text: "If registration asks you to confirm your email, follow the email link first. Sign in to reach your job seeker dashboard. It currently shows a welcome message." },
    { title: "Find a job", icon: Search, available: true, text: "Search open roles and filter by category and location. Open a job to review its details." },
    { title: "Apply with your CV", icon: FileText, available: true, text: "Upload your CV and submit an application for a chosen job. CV upload and application submission are not yet available." },
    { title: "Track your application", icon: ListChecks, available: true, text: "See each application in your dashboard, with a Pending, Shortlisted, or Rejected status." },
  ],
  employer: [
    { title: "Create your employer account", icon: UserRoundPlus, available: true, text: "Choose Employer on the registration form. Enter your full name, company name, email, and password." },
    { title: "Sign in and open your dashboard", icon: Briefcase, available: true, text: "If registration asks you to confirm your email, follow the email link first. Sign in to reach your employer dashboard. It currently shows a welcome message." },
    { title: "Publish and manage jobs", icon: FileText, available: true, text: "Create a job posting, then edit or delete it when needed. Job posting and management are not yet available." },
    { title: "Review applicants", icon: UserRound, available: true, text: "Open applications for your own job postings and review applicants' CVs." },
    { title: "Update application status", icon: ListChecks, available: true, text: "Change an application from Pending to Shortlisted or Rejected so the job seeker can track the outcome." },
  ],
};

function WorkflowPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <div className="border-b pb-8">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary"><FileText className="h-4 w-4" /> HireWave guide</div>
        <h1 className="text-3xl font-bold sm:text-4xl">Website workflow</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">From creating an account to finding a job or making a hire. Follow the journey for your role below.</p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Available now</span>
          <span className="flex items-center gap-2 text-muted-foreground"><Clock3 className="h-4 w-4" /> Planned — not yet available</span>
        </div>
      </div>

      <Tabs defaultValue="seeker" className="mt-8">
        <TabsList className="grid h-11 w-full max-w-md grid-cols-2">
          <TabsTrigger value="seeker" className="gap-2"><UserRound className="h-4 w-4" /> Job seeker</TabsTrigger>
          <TabsTrigger value="employer" className="gap-2"><Briefcase className="h-4 w-4" /> Employer</TabsTrigger>
        </TabsList>
        {(["seeker", "employer"] as const).map((role) => (
          <TabsContent key={role} value={role} className="mt-8">
            <h2 className="text-xl font-semibold">{role === "seeker" ? "Your path to a new job" : "Your path to your next hire"}</h2>
            <ol className="mt-6">
              {journeys[role].map(({ title, icon: Icon, text, available }, index) => (
                <li key={title} className="relative flex gap-4 pb-8 last:pb-0 sm:gap-6">
                  {index < journeys[role].length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-5 top-11 w-px bg-border" />}
                  <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${available ? "bg-primary text-primary-foreground" : "border bg-background text-muted-foreground"}`}>{index + 1}</span>
                  <div className="min-w-0 flex-1 pt-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h3 className="flex items-center gap-2 text-base font-semibold"><Icon className="h-4 w-4 shrink-0 text-muted-foreground" />{title}</h3>
                      <span className={`text-xs font-medium ${available ? "text-primary" : "text-muted-foreground"}`}>{available ? "Available now" : "Planned"}</span>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t pt-6">
              <Button asChild><Link to="/auth" search={{ mode: "signup", role }}>Register as {role === "seeker" ? "a job seeker" : "an employer"}<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <Button asChild variant="outline"><Link to="/auth" search={{ mode: "signin", role }}>Sign in</Link></Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <section className="mt-12 border-t pt-8" aria-labelledby="application-statuses">
        <h2 id="application-statuses" className="text-xl font-semibold">Application statuses</h2>
        <p className="mt-2 text-sm text-muted-foreground">These statuses will be used when applications are available.</p>
        <dl className="mt-5 grid gap-6 sm:grid-cols-3">
          <div><dt className="font-semibold">Pending</dt><dd className="mt-1 text-sm leading-6 text-muted-foreground">The application has been submitted and is awaiting review.</dd></div>
          <div><dt className="font-semibold">Shortlisted</dt><dd className="mt-1 text-sm leading-6 text-muted-foreground">The employer has selected the applicant for further consideration.</dd></div>
          <div><dt className="font-semibold">Rejected</dt><dd className="mt-1 text-sm leading-6 text-muted-foreground">The employer is not proceeding with this application.</dd></div>
        </dl>
      </section>
    </main>
  );
}