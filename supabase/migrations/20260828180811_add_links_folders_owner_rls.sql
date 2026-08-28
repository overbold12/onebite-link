alter table public.links enable row level security;
alter table public.folders enable row level security;

create policy "links_select_own"
on public.links
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "links_insert_own"
on public.links
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "links_update_own"
on public.links
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "links_delete_own"
on public.links
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "folders_select_own"
on public.folders
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "folders_insert_own"
on public.folders
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "folders_update_own"
on public.folders
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "folders_delete_own"
on public.folders
for delete
to authenticated
using ((select auth.uid()) = user_id);
