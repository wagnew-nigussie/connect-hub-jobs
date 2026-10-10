import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const router = useRouter();
  const [historyState, setHistoryState] = useState({ back: false, forward: false });

  useEffect(() => {
    const history = router.history;
    let furthestIndex = history.location.state.__TSR_index;
    const update = () => {
      const index = history.location.state.__TSR_index;
      setHistoryState({ back: history.canGoBack(), forward: index < furthestIndex });
    };
    update();
    return history.subscribe(({ location, action }) => {
      const index = location.state.__TSR_index;
      furthestIndex = action.type === "PUSH" ? index : Math.max(furthestIndex, index);
      update();
    });
  }, [router]);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <TooltipProvider delayDuration={200}>
            <div className="flex items-center gap-1" role="group" aria-label="Page history">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Go back" disabled={!historyState.back} onClick={() => router.history.back()}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Back</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Go forward" disabled={!historyState.forward} onClick={() => router.history.forward()}>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Forward</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="h-4 w-4" />
          </span>
          HireWave
        </Link>
        </div>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/jobs">Jobs</Link>
          </Button>
          {!loading && session ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
