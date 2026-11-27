-- iFoome Delivery: execute no SQL Editor do Supabase.
create extension if not exists pgcrypto;

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.dishes (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  ingredients text not null,
  description text not null default '',
  price numeric(10,2) not null check (price > 0),
  photo_url text,
  available_today boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  order_number bigint generated always as identity,
  customer_name text not null,
  customer_phone text not null,
  address text not null,
  payment text not null check (payment in ('Pix na entrega','Dinheiro na entrega','Cartão na maquininha')),
  notes text not null default '',
  status text not null default 'recebido' check (status in ('recebido','em_preparo','saiu_para_entrega')),
  total numeric(10,2) not null default 0 check (total >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  dish_id uuid references public.dishes(id) on delete set null,
  dish_name text not null,
  unit_price numeric(10,2) not null check (unit_price > 0),
  quantity integer not null check (quantity > 0)
);

alter table public.restaurants enable row level security;
alter table public.dishes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "owner reads own restaurant" on public.restaurants for select to authenticated using (owner_id = auth.uid());
create policy "owner updates own restaurant" on public.restaurants for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner manages dishes" on public.dishes for all to authenticated
  using (exists(select 1 from public.restaurants r where r.id=restaurant_id and r.owner_id=auth.uid()))
  with check (exists(select 1 from public.restaurants r where r.id=restaurant_id and r.owner_id=auth.uid()));
create policy "owner reads orders" on public.orders for select to authenticated
  using (exists(select 1 from public.restaurants r where r.id=restaurant_id and r.owner_id=auth.uid()));
create policy "owner updates orders" on public.orders for update to authenticated
  using (exists(select 1 from public.restaurants r where r.id=restaurant_id and r.owner_id=auth.uid()))
  with check (exists(select 1 from public.restaurants r where r.id=restaurant_id and r.owner_id=auth.uid()));
create policy "owner reads order items" on public.order_items for select to authenticated
  using (exists(select 1 from public.orders o join public.restaurants r on r.id=o.restaurant_id where o.id=order_id and r.owner_id=auth.uid()));

-- A função valida os pratos e calcula os preços no servidor.
create or replace function public.create_public_order(
  p_restaurant_slug text, p_customer_name text, p_customer_phone text,
  p_address text, p_payment text, p_notes text, p_items jsonb
) returns bigint language plpgsql security definer set search_path=public as $$
declare
  v_restaurant restaurants%rowtype;
  v_order orders%rowtype;
  v_item jsonb;
  v_dish dishes%rowtype;
  v_total numeric(10,2) := 0;
begin
  if length(trim(p_customer_name)) < 2 or length(regexp_replace(p_customer_phone,'\D','','g')) < 10
     or length(trim(p_address)) < 5 then raise exception 'Dados do cliente inválidos'; end if;
  if p_payment not in ('Pix na entrega','Dinheiro na entrega','Cartão na maquininha') then raise exception 'Pagamento inválido'; end if;
  select * into v_restaurant from restaurants where slug=p_restaurant_slug;
  if not found then raise exception 'Restaurante não encontrado'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items)=0 then raise exception 'Pedido vazio'; end if;
  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_dish from dishes where id=(v_item->>'dish_id')::uuid and restaurant_id=v_restaurant.id and available_today=true;
    if not found then raise exception 'Prato indisponível'; end if;
    if (v_item->>'quantity')::int < 1 or (v_item->>'quantity')::int > 50 then raise exception 'Quantidade inválida'; end if;
    v_total := v_total + v_dish.price * (v_item->>'quantity')::int;
  end loop;
  insert into orders(restaurant_id,customer_name,customer_phone,address,payment,notes,total)
  values(v_restaurant.id,trim(p_customer_name),trim(p_customer_phone),trim(p_address),p_payment,coalesce(p_notes,''),v_total)
  returning * into v_order;
  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_dish from dishes where id=(v_item->>'dish_id')::uuid and restaurant_id=v_restaurant.id;
    insert into order_items(order_id,dish_id,dish_name,unit_price,quantity)
    values(v_order.id,v_dish.id,v_dish.name,v_dish.price,(v_item->>'quantity')::int);
  end loop;
  return v_order.order_number;
end; $$;
grant execute on function public.create_public_order(text,text,text,text,text,text,jsonb) to anon, authenticated;

-- Leitura pública apenas dos pratos disponíveis de restaurantes publicados.
create policy "public sees available dishes" on public.dishes for select to anon, authenticated using (available_today=true);
-- Habilite Realtime para a tabela orders no painel Supabase.
