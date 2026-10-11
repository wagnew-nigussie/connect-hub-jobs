import type { Database } from "@/integrations/supabase/types";

export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type JobType = Database["public"]["Enums"]["job_type"];
export type AppStatus = Database["public"]["Enums"]["application_status"];

export const CATEGORIES = [
  "Engineering", "Design", "Marketing", "Sales", "Finance", "Healthcare",
  "Education", "Customer Support", "Operations", "Other",
];

export const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
];

export const jobTypeLabel = (t: JobType) => JOB_TYPES.find((j) => j.value === t)?.label ?? t;

export const STATUS_STYLES: Record<AppStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  shortlisted: "bg-primary-soft text-primary",
  rejected: "bg-destructive/10 text-destructive",
};
