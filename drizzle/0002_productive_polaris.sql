ALTER TABLE "wiki" ADD COLUMN "image_url" varchar(500);--> statement-breakpoint
ALTER TABLE "wiki" ADD COLUMN "category_id" integer;--> statement-breakpoint
ALTER TABLE "wiki" ADD CONSTRAINT "wiki_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;