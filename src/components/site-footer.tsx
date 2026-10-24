import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Briefcase,
  Mail,
  Send,
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SiteFooter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing to Connect Hub Jobs alerts!");
    setEmail("");
  };

  return (
    <footer className="border-t bg-card text-card-foreground">
      {/* Top Banner / Newsletter CTA */}
      <div className="border-b bg-primary/5 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Weekly Job Digest</span>
            </div>
            <h3 className="text-xl font-bold">Get curated tech jobs delivered to your inbox</h3>
            <p className="text-sm text-muted-foreground">
              No spam. Only verified high-paying roles matching your skill set.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-background"
                required
              />
            </div>
            <Button type="submit" className="gap-1.5">
              <span>Subscribe</span>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-bold">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25">
                <Briefcase className="h-5 w-5" />
              </span>
              <span>
                Connect Hub <span className="text-primary">Jobs</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              The modern hiring platform connecting ambitious talent with innovative companies.
              Browse verified jobs, apply directly with your CV, and accelerate your career.
            </p>
            <div className="flex items-center gap-3 pt-2 text-muted-foreground">
              <a
                href="https://github.com/wagnew-nigussie/connect-hub-jobs"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border p-2 transition hover:bg-muted hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border p-2 transition hover:bg-muted hover:text-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border p-2 transition hover:bg-muted hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Systems Live</span>
              </div>
            </div>
          </div>

          {/* Column 1: For Job Seekers */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              For Seekers
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/jobs" className="transition hover:text-primary">
                  Browse All Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  search={{ category: "Engineering" }}
                  className="transition hover:text-primary"
                >
                  Remote Tech Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  search={{ mode: "signup", role: "seeker" }}
                  className="transition hover:text-primary"
                >
                  Create Candidate Profile
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="transition hover:text-primary">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link
                  to="/workflow"
                  className="flex items-center gap-1 transition hover:text-primary"
                >
                  <span>Seeker Guide</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: For Employers */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              For Employers
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/auth"
                  search={{ mode: "signup", role: "employer" }}
                  className="transition hover:text-primary"
                >
                  Post a Job Opening
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="transition hover:text-primary">
                  Applicant Management
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  search={{ mode: "signin", role: "employer" }}
                  className="transition hover:text-primary"
                >
                  Employer Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/workflow"
                  className="flex items-center gap-1 transition hover:text-primary"
                >
                  <span>Hiring Playbook</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Trust */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>100% Verified Employers</span>
              </li>
              <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Encrypted CV Storage</span>
              </li>
              <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Transparent Salaries</span>
              </li>
              <li className="pt-2">
                <Link to="/workflow" className="text-xs text-primary font-medium hover:underline">
                  View Full Workflow &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Connect Hub Jobs. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/workflow" className="hover:text-foreground transition">
              Workflow Guide
            </Link>
            <Link to="/jobs" className="hover:text-foreground transition">
              Explore Openings
            </Link>
            <Link to="/auth" className="hover:text-foreground transition">
              Account Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
