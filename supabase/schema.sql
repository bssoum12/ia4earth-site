-- À exécuter une fois dans l'éditeur SQL de Supabase.
create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nom text not null,
  organisation text not null default '',
  email text not null default '',
  telephone text not null default '',
  categorie text not null,
  message text not null default '',
  source text not null default 'site' check (source in ('site', 'manuel')),
  badge_printed_at timestamptz
);

-- Aucune politique : seule la clé « service role » (serveur) peut lire/écrire. La clé publique n'a aucun accès.
alter table public.participants enable row level security;

-- ---------------------------------------------------------------------
-- Master class : 20 places par master class, une master class par personne et par jour.
-- ---------------------------------------------------------------------
create table if not exists public.masterclass_registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  class_id text not null,
  day int not null,
  nom text not null,
  email text not null,
  telephone text not null default '',
  organisation text not null default ''
);
create unique index if not exists masterclass_class_email on public.masterclass_registrations (class_id, lower(email));
create unique index if not exists masterclass_day_email on public.masterclass_registrations (day, lower(email));
alter table public.masterclass_registrations enable row level security;

-- Inscription atomique : verrous (personne et jour, puis master class), contrôle des doublons et de la capacité.
-- Retourne 'ok', 'full', 'duplicate' ou 'same_day'.
create or replace function public.register_masterclass(
  p_class_id text, p_day int, p_capacity int, p_nom text, p_email text, p_telephone text, p_organisation text
) returns text language plpgsql security definer set search_path = public as $$
declare
  v_email text := lower(trim(p_email));
  v_count int;
begin
  perform pg_advisory_xact_lock(hashtext('mc-day:' || p_day || ':' || v_email));
  perform pg_advisory_xact_lock(hashtext('mc-class:' || p_class_id));
  if exists (select 1 from masterclass_registrations where class_id = p_class_id and lower(email) = v_email) then
    return 'duplicate';
  end if;
  if exists (select 1 from masterclass_registrations where day = p_day and lower(email) = v_email) then
    return 'same_day';
  end if;
  select count(*) into v_count from masterclass_registrations where class_id = p_class_id;
  if v_count >= p_capacity then
    return 'full';
  end if;
  insert into masterclass_registrations (class_id, day, nom, email, telephone, organisation)
  values (p_class_id, p_day, p_nom, v_email, p_telephone, p_organisation);
  return 'ok';
end $$;
revoke all on function public.register_masterclass(text, int, int, text, text, text, text) from public, anon, authenticated;
grant execute on function public.register_masterclass(text, int, int, text, text, text, text) to service_role;
