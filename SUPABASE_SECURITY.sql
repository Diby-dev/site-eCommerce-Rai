-- À exécuter une seule fois dans Supabase > SQL Editor, après sauvegarde de la base.
-- Cette règle protège aussi les appels directs à l'API Supabase : l'interface
-- Next.js seule ne peut pas empêcher un utilisateur de fabriquer une requête HTTP.

begin;

alter table public.admis enable row level security;
alter table public.tshirt enable row level security;

-- Fonction exécutée côté base : aucun navigateur ne peut se déclarer admin.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admis
    where email_admis = (select auth.jwt() ->> 'email')
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Un utilisateur connecté peut seulement vérifier sa propre entrée admin.
create policy "admin_can_read_own_profile"
on public.admis for select to authenticated
using (email_admis = (select auth.jwt() ->> 'email'));

-- Le catalogue reste public pour la boutique, mais seuls les admins peuvent
-- créer, modifier ou supprimer les produits.
create policy "catalogue_is_publicly_readable"
on public.tshirt for select
using (true);

create policy "only_admins_insert_tshirts"
on public.tshirt for insert to authenticated
with check ((select public.is_admin()));

create policy "only_admins_update_tshirts"
on public.tshirt for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "only_admins_delete_tshirts"
on public.tshirt for delete to authenticated
using ((select public.is_admin()));

-- Le bucket d'images est public en lecture, mais protégé en écriture.
create policy "catalogue_images_are_publicly_readable"
on storage.objects for select
using (bucket_id = 'images-tshirts');

create policy "only_admins_manage_catalogue_images"
on storage.objects for all to authenticated
using (bucket_id = 'images-tshirts' and (select public.is_admin()))
with check (bucket_id = 'images-tshirts' and (select public.is_admin()));

commit;
