import { useState, useEffect } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "connect_hub_saved_jobs";

export function useSavedJobs() {
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedJobIds(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleSaveJob = (jobId: string, title?: string) => {
    setSavedJobIds((prev) => {
      const isSaved = prev.includes(jobId);
      const next = isSaved ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      if (isSaved) {
        toast.info(title ? `Removed "${title}" from saved jobs` : "Job removed from saved jobs");
      } else {
        toast.success(title ? `Saved "${title}" to your list!` : "Job bookmarked!");
      }
      return next;
    });
  };

  const isJobSaved = (jobId: string) => savedJobIds.includes(jobId);

  return {
    savedJobIds,
    toggleSaveJob,
    isJobSaved,
  };
}
