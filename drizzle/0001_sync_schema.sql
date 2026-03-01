-- Add missing columns to communities
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "community_type" varchar(50) DEFAULT 'default' NOT NULL;
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "plan" text DEFAULT 'free' NOT NULL;
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "plan_member_limit" integer DEFAULT 20;
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "stripe_customer_id" text;
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "stripe_subscription_id" text;
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "plan_expires_at" timestamp;

-- Add missing column to community_members
ALTER TABLE "community_members" ADD COLUMN IF NOT EXISTS "dues_paid" boolean DEFAULT false NOT NULL;

-- Add missing columns to users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "skills" text[];
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "individual_plan" text DEFAULT 'free';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "individual_plan_expires_at" timestamp;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "individual_stripe_subscription_id" text;

-- Create new tables
CREATE TABLE IF NOT EXISTS "vendors" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "community_id" integer NOT NULL REFERENCES "communities"("id"),
    "name" text NOT NULL,
    "categories" text[],
    "phone" text,
    "email" text,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "issues" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "community_id" integer NOT NULL REFERENCES "communities"("id"),
    "reported_by" integer NOT NULL REFERENCES "users"("id"),
    "title" text NOT NULL,
    "description" text NOT NULL,
    "category" text NOT NULL,
    "location" text NOT NULL,
    "photo_url" text,
    "status" text DEFAULT 'submitted' NOT NULL,
    "assigned_vendor_id" uuid REFERENCES "vendors"("id"),
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "issue_updates" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "issue_id" uuid NOT NULL REFERENCES "issues"("id"),
    "updated_by" integer NOT NULL REFERENCES "users"("id"),
    "previous_status" text,
    "new_status" text NOT NULL,
    "note" text,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "vendor_ratings" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "vendor_id" uuid NOT NULL REFERENCES "vendors"("id"),
    "issue_id" uuid NOT NULL REFERENCES "issues"("id"),
    "rated_by" integer NOT NULL REFERENCES "users"("id"),
    "rating" integer NOT NULL,
    "comment" text,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "notifications" (
    "id" serial PRIMARY KEY,
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "type" text NOT NULL,
    "title" text NOT NULL,
    "body" text NOT NULL,
    "href" text,
    "is_read" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL -- Note: schema.ts uses createdAt (serial) but this is serial id, so I'll follow schema naming
);

-- Fix notifications createdAt name if necessary (schema.ts has it as createdAt, not created_at)
-- wait, schema.ts line 279: createdAt: timestamp('created_at').defaultNow().notNull(),
-- Ah, the property name is createdAt, the column name is 'created_at'.

ALTER TABLE "notifications" RENAME COLUMN "createdAt" TO "created_at";

CREATE TABLE IF NOT EXISTS "help_requests" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "community_id" integer NOT NULL REFERENCES "communities"("id"),
    "requested_by" integer NOT NULL REFERENCES "users"("id"),
    "title" text NOT NULL,
    "description" text NOT NULL,
    "tags" text[],
    "needed_by" timestamp,
    "is_resolved" boolean DEFAULT false NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "help_offers" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "request_id" uuid NOT NULL REFERENCES "help_requests"("id"),
    "offered_by" integer NOT NULL REFERENCES "users"("id"),
    "message" text,
    "created_at" timestamp DEFAULT now() NOT NULL
);
