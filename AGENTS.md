<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Roles live in `public.user_roles` (seeker/employer), set once at signup by the `handle_new_user` trigger; RLS uses `has_role()` — never trust client metadata for permissions.
- CVs are stored in the private `cvs` bucket under `{user_id}/...`; employers read them only via an application on their job.
- Client auth state comes from `AuthProvider` (`src/hooks/use-auth.tsx`); signed-in pages live under `src/routes/_authenticated/`.
