-- Inox Link Database Rebuild SQL

-- 1. DROP EXISTING TABLES (Just in case)
DROP TABLE IF EXISTS "wiki" CASCADE;
DROP TABLE IF EXISTS "news" CASCADE;
DROP TABLE IF EXISTS "authors" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "posts" CASCADE;

-- 2. CREATE CATEGORIES
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_name_key_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_key_unique" UNIQUE("slug")
);

-- 3. CREATE AUTHORS
CREATE TABLE "authors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"avatar_url" varchar(500),
	"bio" text,
	"social_links" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "authors_slug_key_unique" UNIQUE("slug")
);

-- 4. CREATE NEWS
CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"image_url" varchar(500),
	"category_id" integer,
	"author_id" integer,
	"featured_level" integer DEFAULT 0,
	"published" boolean DEFAULT false,
	"meta_title" varchar(255),
	"meta_description" text,
	"keywords" text,
	"canonical_url" varchar(500),
	"og_title" varchar(255),
	"og_description" text,
	"og_image" varchar(500),
	"twitter_card" varchar(50) DEFAULT 'summary_large_image',
	"tags" jsonb,
	"structured_data" jsonb,
	"reading_time" integer,
	"image_alt" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"published_at" timestamp,
	"last_modified" timestamp,
	"capa_nova" uuid,
	CONSTRAINT "news_slug_key_unique" UNIQUE("slug"),
    CONSTRAINT "news_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL,
    CONSTRAINT "news_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE SET NULL
);

-- 5. CREATE WIKI
CREATE TABLE "wiki" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"author_id" integer,
	"meta_title" varchar(255),
	"meta_description" text,
	"tags" jsonb,
	"structured_data" jsonb,
	"og_image" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "wiki_slug_key_unique" UNIQUE("slug"),
    CONSTRAINT "wiki_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE SET NULL
);

-- 6. INDEXES
CREATE INDEX "idx_news_category" ON "news" ("category_id");
CREATE INDEX "idx_news_published" ON "news" ("published");
CREATE INDEX "idx_news_slug" ON "news" ("slug");
CREATE INDEX "idx_news_tags" ON "news" USING gin ("tags");
CREATE INDEX "idx_wiki_slug" ON "wiki" ("slug");
CREATE INDEX "idx_categories_slug" ON "categories" ("slug");
CREATE INDEX "idx_authors_slug" ON "authors" ("slug");
