

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."find_nearest_riders"("user_lat" double precision, "user_lng" double precision, "max_distance" double precision DEFAULT NULL::double precision) RETURNS TABLE("rider_id" "uuid", "phone" "text", "metadata" "jsonb", "distance" double precision, "is_available" boolean)
    LANGUAGE "sql"
    AS $$
  select
    r.user_id as rider_id,
    u.phone,
    u.raw_user_meta_data as metadata,
    ST_Distance(
      r.location::geography,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) as distance,
    r.is_available
  from "Riders" r
  join auth.users u on r.user_id = u.id
  where
    (
      max_distance is null
      or ST_DWithin(
        r.location::geography,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
        max_distance
      )
    )
  order by
    r.is_available desc,
    distance asc
$$;


ALTER FUNCTION "public"."find_nearest_riders"("user_lat" double precision, "user_lng" double precision, "max_distance" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."find_nearest_riders"("user_lat" double precision, "user_lng" double precision, "max_distance" double precision DEFAULT NULL::double precision, "filter_company_id" "uuid" DEFAULT NULL::"uuid") RETURNS TABLE("rider_id" "uuid", "phone" "text", "metadata" "jsonb", "distance" double precision, "is_available" boolean)
    LANGUAGE "sql"
    AS $$
  select
    r.user_id as rider_id,
    u.phone,
    u.raw_user_meta_data as metadata,
    ST_Distance(
      r.location::geography,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) as distance,
    r.is_available
  from "Riders" r
  join auth.users u on r.user_id = u.id
  where
    (
      max_distance is null
      or ST_DWithin(
        r.location::geography,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
        max_distance
      )
    ) and (r.company_id = filter_company_id or filter_company_id is null)

  order by
    r.is_available desc,
    distance asc
  limit 5
$$;


ALTER FUNCTION "public"."find_nearest_riders"("user_lat" double precision, "user_lng" double precision, "max_distance" double precision, "filter_company_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Companies" (
    "company_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "Name" "text" NOT NULL
);


ALTER TABLE "public"."Companies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Deliveries" (
    "delivery_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid" NOT NULL,
    "rider_id" "uuid",
    "assigned_at" timestamp with time zone,
    "status" "text" DEFAULT 'pending'::"text",
    "eta" "text",
    "user_id" "uuid" NOT NULL,
    CONSTRAINT "Deliveries_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'accepted'::"text", 'in_progress'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."Deliveries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Orders" (
    "order_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "pickup" json,
    "dropoff" json,
    "description" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "extras" "jsonb",
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "order_type" "text",
    "price" numeric,
    "ref_number" bigint DEFAULT ("floor"((("random"() * (90000000)::double precision) + (10000000)::double precision)))::bigint NOT NULL
);


ALTER TABLE "public"."Orders" OWNER TO "postgres";


COMMENT ON TABLE "public"."Orders" IS 'User Orders';



CREATE TABLE IF NOT EXISTS "public"."Riders" (
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "company_id" "uuid",
    "is_available" boolean DEFAULT true NOT NULL,
    "location" "public"."geography",
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."Riders" OWNER TO "postgres";


ALTER TABLE ONLY "public"."Companies"
    ADD CONSTRAINT "Companies_company_id_key" UNIQUE ("company_id");



ALTER TABLE ONLY "public"."Companies"
    ADD CONSTRAINT "Companies_pkey" PRIMARY KEY ("company_id");



ALTER TABLE ONLY "public"."Deliveries"
    ADD CONSTRAINT "Deliveries_id_key" UNIQUE ("delivery_id");



ALTER TABLE ONLY "public"."Orders"
    ADD CONSTRAINT "Orders_order_id_key" UNIQUE ("order_id");



ALTER TABLE ONLY "public"."Orders"
    ADD CONSTRAINT "Orders_pkey" PRIMARY KEY ("order_id", "ref_number");



ALTER TABLE ONLY "public"."Orders"
    ADD CONSTRAINT "Orders_ref_number_key" UNIQUE ("ref_number");



ALTER TABLE ONLY "public"."Riders"
    ADD CONSTRAINT "Riders_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."Riders"
    ADD CONSTRAINT "Riders_rider_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."Deliveries"
    ADD CONSTRAINT "deliveries_pkey" PRIMARY KEY ("delivery_id");



CREATE INDEX "idx_riders_location" ON "public"."Riders" USING "gist" ("location");



ALTER TABLE ONLY "public"."Deliveries"
    ADD CONSTRAINT "Deliveries_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."Orders"("order_id") ON UPDATE CASCADE ON DELETE SET DEFAULT;



ALTER TABLE ONLY "public"."Deliveries"
    ADD CONSTRAINT "Deliveries_rider_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "public"."Riders"("user_id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Deliveries"
    ADD CONSTRAINT "Deliveries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Orders"
    ADD CONSTRAINT "Orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE SET DEFAULT;



ALTER TABLE ONLY "public"."Riders"
    ADD CONSTRAINT "Riders_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."Companies"("company_id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Riders"
    ADD CONSTRAINT "Riders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE SET DEFAULT;



CREATE POLICY "Allow users to view companies" ON "public"."Companies" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."Companies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Deliveries" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Enable delete for users" ON "public"."Deliveries" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."Orders" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."Orders" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Enable read access for all users" ON "public"."Orders" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for user" ON "public"."Deliveries" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable update access for assigned riders" ON "public"."Deliveries" FOR UPDATE TO "authenticated" USING (("rider_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Enable update for user" ON "public"."Deliveries" FOR UPDATE TO "authenticated" USING (( SELECT ("auth"."uid"() = "Deliveries"."user_id")));



CREATE POLICY "Enable update for users" ON "public"."Orders" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."Orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Riders" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."find_nearest_riders"("user_lat" double precision, "user_lng" double precision, "max_distance" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."find_nearest_riders"("user_lat" double precision, "user_lng" double precision, "max_distance" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."find_nearest_riders"("user_lat" double precision, "user_lng" double precision, "max_distance" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."find_nearest_riders"("user_lat" double precision, "user_lng" double precision, "max_distance" double precision, "filter_company_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."find_nearest_riders"("user_lat" double precision, "user_lng" double precision, "max_distance" double precision, "filter_company_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."find_nearest_riders"("user_lat" double precision, "user_lng" double precision, "max_distance" double precision, "filter_company_id" "uuid") TO "service_role";



GRANT ALL ON TABLE "public"."Companies" TO "anon";
GRANT ALL ON TABLE "public"."Companies" TO "authenticated";
GRANT ALL ON TABLE "public"."Companies" TO "service_role";



GRANT ALL ON TABLE "public"."Deliveries" TO "anon";
GRANT ALL ON TABLE "public"."Deliveries" TO "authenticated";
GRANT ALL ON TABLE "public"."Deliveries" TO "service_role";



GRANT ALL ON TABLE "public"."Orders" TO "anon";
GRANT ALL ON TABLE "public"."Orders" TO "authenticated";
GRANT ALL ON TABLE "public"."Orders" TO "service_role";



GRANT ALL ON TABLE "public"."Riders" TO "anon";
GRANT ALL ON TABLE "public"."Riders" TO "authenticated";
GRANT ALL ON TABLE "public"."Riders" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






RESET ALL;
