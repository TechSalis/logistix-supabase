create type "public"."MessageStatus" as enum ('sent', 'delivered', 'seen');

drop policy "Allow anonymous access" on "public"."locations";

drop policy "Restrict access to anonymous users" on "public"."messages";

alter table "public"."fcm_tokens" drop constraint "fcm_tokens_fcm_token_key";

drop index if exists "public"."fcm_tokens_fcm_token_key";

alter table "public"."locations" enable row level security;

alter table "public"."messages" add column "chat_id" text generated always as (((LEAST((sender_id)::text, (recipient_id)::text) || '|'::text) || GREATEST((sender_id)::text, (recipient_id)::text))) stored;

alter table "public"."messages" add column "status" "MessageStatus" not null default 'sent'::"MessageStatus";

CREATE INDEX messages_chat_id_created_at_idx ON public.messages USING btree (chat_id, created_at);

CREATE UNIQUE INDEX messages_message_id_key ON public.messages USING btree (message_id);

alter table "public"."messages" add constraint "messages_message_id_key" UNIQUE using index "messages_message_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.fn_find_nearest_riders(user_lat double precision, user_lng double precision, max_distance double precision DEFAULT NULL::double precision, filter_company_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(user_id uuid, metadata jsonb, distance double precision, is_available boolean)
 LANGUAGE plpgsql
AS $function$begin
  return query
  select
    r.user_id,
    u.metadata,
    case
      when l.location is null then null
      else ST_Distance(
        l.location::geography,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
      )
    end as distance,
    r.is_available
  from riders r
  join profiles u on r.user_id = u.user_id
  join locations l on r.user_id = l.user_id
  where
    (
      l.location is null -- allow null locations
      or (
        max_distance is null
        or ST_DWithin(
          l.location::geography,
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
end;$function$
;

create policy "Enable read access for authenticated users"
on "public"."fcm_tokens"
as permissive
for select
to authenticated
using (true);



