# Project Guidelines

- Roles live in `public.user_roles` (seeker/employer), set once at signup by the `handle_new_user` trigger; RLS uses `has_role()` — never trust client metadata for permissions.
- CVs are stored in the private `cvs` bucket under `{user_id}/...`; employers read them only via an application on their job.
- Client auth state comes from `AuthProvider` (`src/hooks/use-auth.tsx`); signed-in pages live under `src/routes/_authenticated/`.
- SiteHeader provides clean branding and navigation for Connect Hub Jobs.
- The public /workflow guide documents both role journeys (seeker and employer).
