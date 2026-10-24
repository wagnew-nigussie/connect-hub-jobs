import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Menu,
  Sparkles,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  LogIn,
  Search,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-primary to-blue-600 text-primary-foreground shadow-md shadow-primary/25 transition-transform hover:scale-105">
              <Briefcase className="h-5 w-5" />
            </span>
            <span className="flex items-center gap-1.5">
              <span>Connect Hub</span>
              <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
                Jobs
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/jobs"
              className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground [&.active]:bg-primary/10 [&.active]:text-primary"
            >
              Browse Jobs
            </Link>
            <Link
              to="/workflow"
              className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground [&.active]:bg-primary/10 [&.active]:text-primary"
            >
              How It Works
            </Link>
          </nav>
        </div>

        {/* Right Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link to="/auth" search={{ mode: "signup", role: "employer" }}>
              <PlusCircle className="h-4 w-4 text-primary" />
              <span>Post a Job</span>
            </Link>
          </Button>

          {!loading && session ? (
            <div className="flex items-center gap-2 border-l pl-3">
              <Button asChild variant="ghost" size="sm" className="gap-1.5">
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="gap-1.5 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Sign out</span>
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" className="gap-1.5 shadow-sm">
              <Link to="/auth">
                <LogIn className="h-4 w-4" />
                <span>Sign in</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-6 flex flex-col justify-between">
              <div>
                <SheetHeader className="text-left border-b pb-4 mb-6">
                  <SheetTitle className="flex items-center gap-2 font-display text-lg">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                      <Briefcase className="h-4 w-4" />
                    </span>
                    Connect Hub Jobs
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-2">
                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-muted"
                  >
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Home</span>
                  </Link>
                  <Link
                    to="/jobs"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-muted"
                  >
                    <Search className="h-4 w-4 text-primary" />
                    <span>Browse All Jobs</span>
                  </Link>
                  <Link
                    to="/workflow"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-muted"
                  >
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Platform Workflow</span>
                  </Link>

                  <div className="my-4 border-t" />

                  <Link
                    to="/auth"
                    search={{ mode: "signup", role: "employer" }}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Post a Job as Employer</span>
                  </Link>
                </nav>
              </div>

              {/* Mobile Auth Bottom Bar */}
              <div className="border-t pt-4">
                {!loading && session ? (
                  <div className="space-y-2">
                    <Button
                      asChild
                      className="w-full justify-center gap-2"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link to="/dashboard">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Go to Dashboard</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-center gap-2 text-destructive"
                      onClick={() => {
                        setMobileOpen(false);
                        signOut();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    asChild
                    className="w-full justify-center gap-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link to="/auth">
                      <LogIn className="h-4 w-4" />
                      <span>Sign in to your account</span>
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
