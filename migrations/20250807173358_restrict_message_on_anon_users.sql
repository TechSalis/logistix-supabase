create extension if not exists "postgis" with schema "extensions";


create type "public"."OrderStatus" as enum ('pending', 'accepted', 'processing', 'completed', 'cancelled');

create type "public"."OrderType" as enum ('delivery', 'food', 'errands', 'grocery');

create type "public"."UserRole" as enum ('customer', 'rider', 'company');

create table "public"."companies" (
    "company_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null
);


alter table "public"."companies" enable row level security;

create table "public"."fcm_tokens" (
    "fcm_token" text not null,
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."fcm_tokens" enable row level security;

create table "public"."locations" (
    "user_id" uuid not null,
    "location" geography not null,
    "coordinates" jsonb
);


create table "public"."messages" (
    "message_id" uuid not null default uuid_generate_v4(),
    "sender_id" uuid,
    "recipient_id" uuid,
    "content" text,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text)
);


alter table "public"."messages" enable row level security;

create table "public"."orders" (
    "order_id" uuid not null default gen_random_uuid(),
    "pickup" json,
    "dropoff" jsonb,
    "description" text not null,
    "created_at" timestamp with time zone not null default now(),
    "extras" jsonb,
    "user_id" uuid not null default auth.uid(),
    "order_type" "OrderType" not null,
    "price" numeric,
    "ref_number" numeric not null default (floor(((random() * (900000)::double precision) + (100000)::double precision)))::integer
);


alter table "public"."orders" enable row level security;

create table "public"."orders_status" (
    "order_id" uuid not null,
    "rider_id" uuid not null,
    "assigned_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "eta" text,
    "user_id" uuid not null,
    "status" "OrderStatus" not null default 'pending'::"OrderStatus"
);


alter table "public"."orders_status" enable row level security;

create table "public"."profiles" (
    "profile_id" uuid not null,
    "user_id" uuid,
    "metadata" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "role" "UserRole" not null
);


alter table "public"."profiles" enable row level security;

create table "public"."riders" (
    "user_id" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "company_id" uuid,
    "is_available" boolean not null default true,
    "updated_at" timestamp with time zone default now(),
    "rating" numeric
);


alter table "public"."riders" enable row level security;

CREATE UNIQUE INDEX "Companies_company_id_key" ON public.companies USING btree (company_id);

CREATE UNIQUE INDEX "Companies_pkey" ON public.companies USING btree (company_id);

CREATE UNIQUE INDEX "Orders_order_id_key" ON public.orders USING btree (order_id);

CREATE UNIQUE INDEX "Orders_pkey" ON public.orders USING btree (order_id, ref_number);

CREATE UNIQUE INDEX "Profiles_pkey" ON public.profiles USING btree (profile_id);

CREATE UNIQUE INDEX "Profiles_user_id_key" ON public.profiles USING btree (user_id);

CREATE UNIQUE INDEX "Riders_pkey" ON public.riders USING btree (user_id);

CREATE UNIQUE INDEX "Riders_rider_id_key" ON public.riders USING btree (user_id);

CREATE UNIQUE INDEX fcm_tokens_fcm_token_key ON public.fcm_tokens USING btree (fcm_token);

CREATE UNIQUE INDEX fcm_tokens_pkey ON public.fcm_tokens USING btree (user_id);

CREATE UNIQUE INDEX locations_pkey ON public.locations USING btree (user_id);

CREATE UNIQUE INDEX locations_user_id_key ON public.locations USING btree (user_id);

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (message_id);

CREATE UNIQUE INDEX orders_ref_number_key ON public.orders USING btree (ref_number);

CREATE UNIQUE INDEX orders_status_order_id_key ON public.orders_status USING btree (order_id);

CREATE UNIQUE INDEX orders_status_pkey ON public.orders_status USING btree (order_id);

CREATE UNIQUE INDEX profiles_profile_id_key ON public.profiles USING btree (profile_id);

alter table "public"."companies" add constraint "Companies_pkey" PRIMARY KEY using index "Companies_pkey";

alter table "public"."fcm_tokens" add constraint "fcm_tokens_pkey" PRIMARY KEY using index "fcm_tokens_pkey";

alter table "public"."locations" add constraint "locations_pkey" PRIMARY KEY using index "locations_pkey";

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."orders" add constraint "Orders_pkey" PRIMARY KEY using index "Orders_pkey";

alter table "public"."orders_status" add constraint "orders_status_pkey" PRIMARY KEY using index "orders_status_pkey";

alter table "public"."profiles" add constraint "Profiles_pkey" PRIMARY KEY using index "Profiles_pkey";

alter table "public"."riders" add constraint "Riders_pkey" PRIMARY KEY using index "Riders_pkey";

alter table "public"."companies" add constraint "Companies_company_id_key" UNIQUE using index "Companies_company_id_key";

alter table "public"."fcm_tokens" add constraint "fcm_tokens_fcm_token_key" UNIQUE using index "fcm_tokens_fcm_token_key";

alter table "public"."fcm_tokens" add constraint "fcm_tokens_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(profile_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."fcm_tokens" validate constraint "fcm_tokens_user_id_fkey";

alter table "public"."locations" add constraint "locations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."locations" validate constraint "locations_user_id_fkey";

alter table "public"."locations" add constraint "locations_user_id_key" UNIQUE using index "locations_user_id_key";

alter table "public"."messages" add constraint "messages_recipient_id_fkey" FOREIGN KEY (recipient_id) REFERENCES profiles(profile_id) not valid;

alter table "public"."messages" validate constraint "messages_recipient_id_fkey";

alter table "public"."messages" add constraint "messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES profiles(profile_id) not valid;

alter table "public"."messages" validate constraint "messages_sender_id_fkey";

alter table "public"."orders" add constraint "Orders_order_id_key" UNIQUE using index "Orders_order_id_key";

alter table "public"."orders" add constraint "Orders_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES profiles(profile_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."orders" validate constraint "Orders_user_id_fkey1";

alter table "public"."orders" add constraint "orders_ref_number_key" UNIQUE using index "orders_ref_number_key";

alter table "public"."orders_status" add constraint "Deliveries_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(order_id) ON UPDATE CASCADE ON DELETE SET DEFAULT not valid;

alter table "public"."orders_status" validate constraint "Deliveries_order_id_fkey";

alter table "public"."orders_status" add constraint "Deliveries_rider_id_fkey" FOREIGN KEY (rider_id) REFERENCES riders(user_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."orders_status" validate constraint "Deliveries_rider_id_fkey";

alter table "public"."orders_status" add constraint "Deliveries_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES profiles(profile_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."orders_status" validate constraint "Deliveries_user_id_fkey1";

alter table "public"."orders_status" add constraint "orders_status_order_id_key" UNIQUE using index "orders_status_order_id_key";

alter table "public"."profiles" add constraint "Profiles_user_id_key" UNIQUE using index "Profiles_user_id_key";

alter table "public"."profiles" add constraint "profiles_profile_id_key" UNIQUE using index "profiles_profile_id_key";

alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."profiles" validate constraint "profiles_user_id_fkey";

alter table "public"."riders" add constraint "Riders_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(company_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."riders" validate constraint "Riders_company_id_fkey";

alter table "public"."riders" add constraint "Riders_rider_id_key" UNIQUE using index "Riders_rider_id_key";

alter table "public"."riders" add constraint "Riders_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES profiles(profile_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."riders" validate constraint "Riders_user_id_fkey1";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.fn_find_nearest_riders(user_lat double precision, user_lng double precision, max_distance double precision DEFAULT NULL::double precision, filter_company_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(user_id uuid, metadata jsonb, distance double precision, is_available boolean)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  select
    r.user_id,
    u.metadata,
    case
      when r.location is null then null
      else ST_Distance(
        r.location::geography,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
      )
    end as distance,
    r.is_available
  from riders r
  join profiles u on r.user_id = u.user_id
  where
    (
      r.location is null -- allow null locations
      or (
        max_distance is null
        or ST_DWithin(
          r.location::geography,
          ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
          max_distance
        )
      )
    )
    and (
      filter_company_id is null or r.company_id = filter_company_id
    )
  order by
    r.is_available desc,
    distance asc nulls last;
end;
$function$
;

create or replace view "public"."orders_view" as  SELECT o.order_id,
    o.ref_number,
    o.pickup,
    o.dropoff,
    o.description,
    o.order_type,
    os.status,
    os.rider_id,
    o.user_id,
    o.created_at
   FROM (orders o
     LEFT JOIN orders_status os ON ((o.order_id = os.order_id)));


create or replace view "public"."riders_view" as  SELECT r.user_id,
    r.is_available,
        CASE
            WHEN (l.location IS NOT NULL) THEN json_build_object('lat', st_y((l.location)::geometry), 'lng', st_x((l.location)::geometry))
            ELSE NULL::json
        END AS location,
    r.rating,
    p.metadata,
    row_to_json(c.*) AS company
   FROM (((riders r
     LEFT JOIN locations l ON ((r.user_id = l.user_id)))
     LEFT JOIN profiles p ON ((r.user_id = p.user_id)))
     LEFT JOIN companies c ON ((r.company_id = c.company_id)));


CREATE OR REPLACE FUNCTION public.tr_handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$declare
  role public."UserRole" := new.raw_user_meta_data::jsonb->>'role';
begin
  insert into public.profiles (profile_id, user_id, metadata, role)
  values (new.id, new.id, new.raw_user_meta_data, role);

  if role = 'rider'::public."UserRole"
  then
    insert into public.riders (user_id, company_id)
    values (new.id, (new.raw_user_meta_data::jsonb->>'company_id')::uuid);
  end if;

  return new;
end;$function$
;

CREATE OR REPLACE FUNCTION public.tr_move_order_temps()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$declare response jsonb;

image_urls jsonb;

upload_urls jsonb;

secret text;

begin
if NEW.order_type != 'delivery' then return NEW;

end if;

select
  case
    when jsonb_typeof(NEW.extras -> 'image_urls') = 'array' then jsonb_agg(value)
    else '[]'::jsonb
  end
into upload_urls
from
  jsonb_array_elements_text(NEW.extras -> 'image_urls') as t(value);

if upload_urls = '[]'::jsonb then
  return NEW;
end if;


raise warning 'upload_urls: %',
upload_urls;

select
  decrypted_secret into secret
from
  vault.decrypted_secrets
where
  name = 'backend_auth_secret';

raise warning 'secret: %',
secret;

if secret is null then raise exception 'Missing backend_auth_secret from vault';

end if;

select
  net.http_post (
    url := 'http://host.docker.internal:8787/media/move-order-temps',
    headers := jsonb_build_object(
      'Content-Type',
      'application/json',
      'x-auth-secret',
      secret
    ),
    body := jsonb_build_object(
      'order_id',
      NEW.order_id,
      'upload_urls',
      upload_urls
    )
  ) into response;

raise warning 'response: %',
response;

if (response ->> 'status') = '200' then image_urls := (response -> 'body' -> 'image_urls')::jsonb;

update orders
set
  extras = jsonb_set(
    coalesce(extras, '{}'),
    '{image_urls}',
    image_urls,
    true
  )
where
  order_id = NEW.order_id;

else raise warning 'Cloudflare /media/move-order-temps failed: %',
response;

end if;

return NEW;

end;$function$
;

CREATE OR REPLACE FUNCTION public.tr_sync_location_coordinates()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.coordinates := jsonb_build_object(
    'lat', ST_Y(NEW.location::geometry),
    'lng', ST_X(NEW.location::geometry)
  );
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."companies" to "anon";

grant insert on table "public"."companies" to "anon";

grant references on table "public"."companies" to "anon";

grant select on table "public"."companies" to "anon";

grant trigger on table "public"."companies" to "anon";

grant truncate on table "public"."companies" to "anon";

grant update on table "public"."companies" to "anon";

grant delete on table "public"."companies" to "authenticated";

grant insert on table "public"."companies" to "authenticated";

grant references on table "public"."companies" to "authenticated";

grant select on table "public"."companies" to "authenticated";

grant trigger on table "public"."companies" to "authenticated";

grant truncate on table "public"."companies" to "authenticated";

grant update on table "public"."companies" to "authenticated";

grant delete on table "public"."companies" to "service_role";

grant insert on table "public"."companies" to "service_role";

grant references on table "public"."companies" to "service_role";

grant select on table "public"."companies" to "service_role";

grant trigger on table "public"."companies" to "service_role";

grant truncate on table "public"."companies" to "service_role";

grant update on table "public"."companies" to "service_role";

grant delete on table "public"."fcm_tokens" to "anon";

grant insert on table "public"."fcm_tokens" to "anon";

grant references on table "public"."fcm_tokens" to "anon";

grant select on table "public"."fcm_tokens" to "anon";

grant trigger on table "public"."fcm_tokens" to "anon";

grant truncate on table "public"."fcm_tokens" to "anon";

grant update on table "public"."fcm_tokens" to "anon";

grant delete on table "public"."fcm_tokens" to "authenticated";

grant insert on table "public"."fcm_tokens" to "authenticated";

grant references on table "public"."fcm_tokens" to "authenticated";

grant select on table "public"."fcm_tokens" to "authenticated";

grant trigger on table "public"."fcm_tokens" to "authenticated";

grant truncate on table "public"."fcm_tokens" to "authenticated";

grant update on table "public"."fcm_tokens" to "authenticated";

grant delete on table "public"."fcm_tokens" to "service_role";

grant insert on table "public"."fcm_tokens" to "service_role";

grant references on table "public"."fcm_tokens" to "service_role";

grant select on table "public"."fcm_tokens" to "service_role";

grant trigger on table "public"."fcm_tokens" to "service_role";

grant truncate on table "public"."fcm_tokens" to "service_role";

grant update on table "public"."fcm_tokens" to "service_role";

grant delete on table "public"."locations" to "anon";

grant insert on table "public"."locations" to "anon";

grant references on table "public"."locations" to "anon";

grant select on table "public"."locations" to "anon";

grant trigger on table "public"."locations" to "anon";

grant truncate on table "public"."locations" to "anon";

grant update on table "public"."locations" to "anon";

grant delete on table "public"."locations" to "authenticated";

grant insert on table "public"."locations" to "authenticated";

grant references on table "public"."locations" to "authenticated";

grant select on table "public"."locations" to "authenticated";

grant trigger on table "public"."locations" to "authenticated";

grant truncate on table "public"."locations" to "authenticated";

grant update on table "public"."locations" to "authenticated";

grant delete on table "public"."locations" to "service_role";

grant insert on table "public"."locations" to "service_role";

grant references on table "public"."locations" to "service_role";

grant select on table "public"."locations" to "service_role";

grant trigger on table "public"."locations" to "service_role";

grant truncate on table "public"."locations" to "service_role";

grant update on table "public"."locations" to "service_role";

grant delete on table "public"."messages" to "anon";

grant insert on table "public"."messages" to "anon";

grant references on table "public"."messages" to "anon";

grant select on table "public"."messages" to "anon";

grant trigger on table "public"."messages" to "anon";

grant truncate on table "public"."messages" to "anon";

grant update on table "public"."messages" to "anon";

grant delete on table "public"."messages" to "authenticated";

grant insert on table "public"."messages" to "authenticated";

grant references on table "public"."messages" to "authenticated";

grant select on table "public"."messages" to "authenticated";

grant trigger on table "public"."messages" to "authenticated";

grant truncate on table "public"."messages" to "authenticated";

grant update on table "public"."messages" to "authenticated";

grant delete on table "public"."messages" to "service_role";

grant insert on table "public"."messages" to "service_role";

grant references on table "public"."messages" to "service_role";

grant select on table "public"."messages" to "service_role";

grant trigger on table "public"."messages" to "service_role";

grant truncate on table "public"."messages" to "service_role";

grant update on table "public"."messages" to "service_role";

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant delete on table "public"."orders" to "authenticated";

grant insert on table "public"."orders" to "authenticated";

grant references on table "public"."orders" to "authenticated";

grant select on table "public"."orders" to "authenticated";

grant trigger on table "public"."orders" to "authenticated";

grant truncate on table "public"."orders" to "authenticated";

grant update on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

grant delete on table "public"."orders_status" to "anon";

grant insert on table "public"."orders_status" to "anon";

grant references on table "public"."orders_status" to "anon";

grant select on table "public"."orders_status" to "anon";

grant trigger on table "public"."orders_status" to "anon";

grant truncate on table "public"."orders_status" to "anon";

grant update on table "public"."orders_status" to "anon";

grant delete on table "public"."orders_status" to "authenticated";

grant insert on table "public"."orders_status" to "authenticated";

grant references on table "public"."orders_status" to "authenticated";

grant select on table "public"."orders_status" to "authenticated";

grant trigger on table "public"."orders_status" to "authenticated";

grant truncate on table "public"."orders_status" to "authenticated";

grant update on table "public"."orders_status" to "authenticated";

grant delete on table "public"."orders_status" to "service_role";

grant insert on table "public"."orders_status" to "service_role";

grant references on table "public"."orders_status" to "service_role";

grant select on table "public"."orders_status" to "service_role";

grant trigger on table "public"."orders_status" to "service_role";

grant truncate on table "public"."orders_status" to "service_role";

grant update on table "public"."orders_status" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."riders" to "anon";

grant insert on table "public"."riders" to "anon";

grant references on table "public"."riders" to "anon";

grant select on table "public"."riders" to "anon";

grant trigger on table "public"."riders" to "anon";

grant truncate on table "public"."riders" to "anon";

grant update on table "public"."riders" to "anon";

grant delete on table "public"."riders" to "authenticated";

grant insert on table "public"."riders" to "authenticated";

grant references on table "public"."riders" to "authenticated";

grant select on table "public"."riders" to "authenticated";

grant trigger on table "public"."riders" to "authenticated";

grant truncate on table "public"."riders" to "authenticated";

grant update on table "public"."riders" to "authenticated";

grant delete on table "public"."riders" to "service_role";

grant insert on table "public"."riders" to "service_role";

grant references on table "public"."riders" to "service_role";

grant select on table "public"."riders" to "service_role";

grant trigger on table "public"."riders" to "service_role";

grant truncate on table "public"."riders" to "service_role";

grant update on table "public"."riders" to "service_role";

create policy "Allow users to view companies"
on "public"."companies"
as permissive
for select
to authenticated
using (true);


create policy "Enable access for users based on user_id"
on "public"."fcm_tokens"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow anonymous access"
on "public"."locations"
as permissive
for select
to anon
using (true);


create policy "Enable access for authenticated users"
on "public"."locations"
as permissive
for all
to authenticated
using (true);


create policy "Enable access for users based on user_id"
on "public"."messages"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = sender_id));


create policy "Enable read access for all users"
on "public"."messages"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = recipient_id));


create policy "Restrict access to anonymous users"
on "public"."messages"
as restrictive
for select
to anon
using (false);


create policy "Enable delete for users based on user_id"
on "public"."orders"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."orders"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Enable read access for all users"
on "public"."orders"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for users"
on "public"."orders"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable access for user or rider"
on "public"."orders_status"
as permissive
for all
to authenticated
using (((auth.uid() = user_id) OR (auth.uid() = rider_id)));


create policy "Enable insert for authenticated users only"
on "public"."orders_status"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable delete for users based on user_id"
on "public"."profiles"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for users on their data"
on "public"."profiles"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable delete for users based on user_id"
on "public"."riders"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for all users"
on "public"."riders"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for users based on user_id"
on "public"."riders"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id));


CREATE TRIGGER update_location_coordinates BEFORE INSERT OR UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION tr_sync_location_coordinates();

CREATE TRIGGER on_delivery_order_insert AFTER INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION tr_move_order_temps();


