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
