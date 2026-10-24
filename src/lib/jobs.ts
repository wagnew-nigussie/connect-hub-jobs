import type { Database } from "@/integrations/supabase/types";

export type Job = Database["public"]["Tables"]["jobs"]["Row"] & {
  tags?: string[];
  experience?: string;
  featured?: boolean;
  urgent?: boolean;
  logo_url?: string;
  logo_bg?: string;
};

export type JobType = Database["public"]["Enums"]["job_type"];
export type AppStatus = Database["public"]["Enums"]["application_status"];

export const CATEGORIES = [
  "Engineering",
  "Design",
  "Product",
  "AI & Data Science",
  "Marketing",
  "Sales",
  "Finance",
  "Healthcare",
  "Customer Support",
  "Operations",
  "Other",
];

export const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: "full_time", label: "Full-time" },
  { value: "remote", label: "Remote" },
  { value: "contract", label: "Contract" },
  { value: "part_time", label: "Part-time" },
  { value: "internship", label: "Internship" },
];

export const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level (0-2 yrs)" },
  { value: "mid", label: "Mid Level (3-5 yrs)" },
  { value: "senior", label: "Senior Level (5-8 yrs)" },
  { value: "lead", label: "Lead / Principal (8+ yrs)" },
];

export const jobTypeLabel = (t: JobType) => JOB_TYPES.find((j) => j.value === t)?.label ?? t;

export const STATUS_STYLES: Record<AppStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
  shortlisted:
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
  rejected: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300",
};

export interface FeaturedCompany {
  name: string;
  tagline: string;
  rating: number;
  openJobsCount: number;
  logoBg: string;
  badge: string;
}

export const FEATURED_COMPANIES: FeaturedCompany[] = [
  {
    name: "Stripe",
    tagline: "Financial infrastructure for the internet",
    rating: 4.9,
    openJobsCount: 42,
    logoBg: "bg-indigo-600 text-white",
    badge: "Top Employer",
  },
  {
    name: "Vercel",
    tagline: "Develop, preview, ship frontend software",
    rating: 4.8,
    openJobsCount: 28,
    logoBg: "bg-black text-white",
    badge: "Fast Growing",
  },
  {
    name: "Shopify",
    tagline: "The all-in-one commerce platform",
    rating: 4.7,
    openJobsCount: 35,
    logoBg: "bg-emerald-600 text-white",
    badge: "Remote Pioneer",
  },
  {
    name: "Cloudflare",
    tagline: "Making the Internet faster, safer, and better",
    rating: 4.8,
    openJobsCount: 19,
    logoBg: "bg-amber-600 text-white",
    badge: "Tech Leader",
  },
];

export const SAMPLE_JOBS: Job[] = [
  {
    id: "job-sample-1",
    employer_id: "emp-1",
    title: "Senior Full-Stack Engineer (React & Node)",
    company: "Stripe",
    category: "Engineering",
    job_type: "full_time",
    location: "San Francisco, CA (Hybrid)",
    salary_range: "$145,000 - $185,000 / yr",
    description: `We are looking for a Senior Full-Stack Engineer to lead development of next-generation merchant checkout experiences.
    
In this role, you will architect resilient distributed systems, build beautiful, responsive user interfaces with React and TypeScript, and collaborate with product designers and infrastructure specialists.

Our ideal candidate thrives in a high-ownership culture and cares deeply about developer experience, web performance, and reliability at scale.`,
    requirements: `• 5+ years of production experience with TypeScript, React, and Node.js
• Deep understanding of RESTful APIs, relational databases (PostgreSQL), and caching strategies
• Experience designing scalable distributed architectures and microservices
• Strong commitment to software testing (unit, integration, and end-to-end)`,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    experience: "senior",
    featured: true,
    urgent: true,
    logo_bg: "bg-indigo-600 text-white",
  },
  {
    id: "job-sample-2",
    employer_id: "emp-2",
    title: "Lead Product Designer (UI/UX & Design Systems)",
    company: "Vercel",
    category: "Design",
    job_type: "remote",
    location: "Global Remote",
    salary_range: "$130,000 - $165,000 / yr",
    description: `Join our core design team to redefine developer tools and web publishing interfaces.
    
You will craft intuitive user journeys, establish cohesive design systems in Figma, and build prototypes that bridge design and production code. You'll partner closely with engineering leads to ensure our products maintain the highest aesthetic and usability standards.`,
    requirements: `• 4+ years designing high-impact web applications and developer tools
• Proficiency in Figma, design systems architecture, and rapid prototyping
• Working familiarity with HTML/CSS, Tailwind CSS, and modern web UI patterns
• A strong portfolio demonstrating complex problem solving and refined typography`,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    tags: ["Figma", "Design Systems", "UI/UX", "Prototyping"],
    experience: "lead",
    featured: true,
    urgent: false,
    logo_bg: "bg-neutral-900 text-white",
  },
  {
    id: "job-sample-3",
    employer_id: "emp-3",
    title: "Cloud DevOps & Infrastructure Architect",
    company: "Cloudflare",
    category: "Engineering",
    job_type: "full_time",
    location: "Seattle, WA / Remote",
    salary_range: "$150,000 - $190,000 / yr",
    description: `Help us scale edge infrastructure handling billions of web requests every single day.
    
You will build resilient Kubernetes clusters, automate multi-region CI/CD pipelines, optimize cloud spend, and implement zero-trust security postures across production systems.`,
    requirements: `• Proven track record with AWS/GCP, Kubernetes, Docker, and Terraform
• Experience building CI/CD pipelines with GitHub Actions or ArgoCD
• Strong scripting skills in Go, Python, or Bash
• Knowledge of network protocols (BGP, DNS, TLS) and site reliability best practices`,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    tags: ["Kubernetes", "AWS", "Terraform", "Docker", "Go"],
    experience: "senior",
    featured: false,
    urgent: true,
    logo_bg: "bg-amber-600 text-white",
  },
  {
    id: "job-sample-4",
    employer_id: "emp-4",
    title: "Senior AI / ML Research Engineer",
    company: "Anthropic Labs",
    category: "AI & Data Science",
    job_type: "full_time",
    location: "San Francisco, CA",
    salary_range: "$175,000 - $225,000 / yr",
    description: `We are building the future of foundation models and reasoning agents.
    
As a Senior AI Engineer, you will train, evaluate, and deploy state-of-the-art transformer models, build automated RLHF pipelines, and optimize inference engines for latency and throughput.`,
    requirements: `• MS or PhD in Computer Science, Machine Learning, or equivalent experience
• Deep experience with PyTorch, CUDA, and distributed model training (Megatron/DeepSpeed)
• Hands-on work fine-tuning LLMs, retrieval augmented generation (RAG), and evaluation suites
• Publications or demonstrable open-source machine learning contributions`,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    tags: ["Python", "PyTorch", "LLMs", "RAG", "CUDA"],
    experience: "senior",
    featured: true,
    urgent: false,
    logo_bg: "bg-purple-700 text-white",
  },
  {
    id: "job-sample-5",
    employer_id: "emp-5",
    title: "Product Manager, Developer Ecosystem",
    company: "GitHub",
    category: "Product",
    job_type: "remote",
    location: "Worldwide Remote",
    salary_range: "$140,000 - $175,000 / yr",
    description: `Guide the strategy and execution of tools used by over 100 million developers worldwide.
    
You will work cross-functionally with engineers, designers, and marketing to discover developer pain points, define product roadmaps, and ship features that inspire the global software development community.`,
    requirements: `• 4+ years of product management experience shipping SaaS or developer products
• Technical fluency; ability to engage deeply with software engineering teams
• Data-driven mindset with experience defining and measuring telemetry metrics
• Exceptional communication and stakeholder alignment skills`,
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    tags: ["Product Strategy", "Developer Tools", "Agile", "Roadmapping"],
    experience: "mid",
    featured: false,
    urgent: false,
    logo_bg: "bg-slate-900 text-white",
  },
  {
    id: "job-sample-6",
    employer_id: "emp-6",
    title: "Growth Marketing & SEO Specialist",
    company: "Shopify",
    category: "Marketing",
    job_type: "contract",
    location: "New York, NY / Remote",
    salary_range: "$90,000 - $120,000 / yr",
    description: `Accelerate organic merchant acquisition across global search channels.
    
You will run high-velocity A/B tests, conduct technical SEO audits, manage content syndication, and analyze user conversion funnels from landing pages through registration.`,
    requirements: `• 3+ years experience in B2B SaaS growth marketing or performance SEO
• Proven mastery of Google Analytics 4, Search Console, Ahrefs, and Semrush
• Ability to formulate hypotheses, analyze conversion data, and produce actionable insights
• Strong copywriting and communication skills`,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    tags: ["SEO", "Growth", "Analytics", "A/B Testing"],
    experience: "mid",
    featured: false,
    urgent: false,
    logo_bg: "bg-emerald-600 text-white",
  },
];
