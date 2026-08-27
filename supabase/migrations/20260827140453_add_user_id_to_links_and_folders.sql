-- Remove rows that cannot be assigned to an authenticated owner.
delete from public.links;
delete from public.folders;

-- auth.uid() resolves to the user attached to the current Supabase request.
-- Anonymous inserts resolve to NULL and are rejected by the NOT NULL constraint.
alter table public.links
  add column user_id uuid not null default auth.uid()
  references auth.users (id) on delete cascade;

alter table public.folders
  add column user_id uuid not null default auth.uid()
  references auth.users (id) on delete cascade;

create index links_user_id_idx on public.links (user_id);
create index folders_user_id_idx on public.folders (user_id);
