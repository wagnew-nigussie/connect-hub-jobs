# Connect Hub Jobs

A modern, full-stack job application and hiring platform built with TanStack Start, React 19, Tailwind CSS, and Supabase.

## Features

- **Job Seekers**:
  - Browse and search jobs by keyword, category, and location
  - View detailed job descriptions and requirements
  - Apply with CV upload (PDF/Word) and optional cover letter
  - Real-time application tracking dashboard (Pending, Shortlisted, Rejected)

- **Employers**:
  - Employer registration and authentication
  - Post, edit, and delete job listings
  - View applicants and download/view submitted CVs
  - Update applicant status directly from the employer dashboard

## Tech Stack

- **Framework**: TanStack Start / React 19
- **Routing & State**: TanStack Router & TanStack Query
- **Styling**: Tailwind CSS & Radix UI / shadcn/ui components
- **Backend & Database**: Supabase (PostgreSQL, Auth, Storage)
- **Bundler & Server**: Vite & Nitro

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` (or set up `.env`):
```env
VITE_SUPABASE_URL="your-supabase-url"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) or [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```
