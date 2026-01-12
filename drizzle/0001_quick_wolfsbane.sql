ALTER TABLE "directus_activity" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_permissions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_files" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_collections" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_folders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_roles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_presets" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_fields" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_relations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_revisions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_migrations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_translations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_operations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_webhooks" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_versions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_panels" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_dashboards" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_notifications" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_shares" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_flows" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_settings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_extensions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_policies" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_access" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "directus_comments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "directus_activity" CASCADE;--> statement-breakpoint
DROP TABLE "directus_permissions" CASCADE;--> statement-breakpoint
DROP TABLE "directus_files" CASCADE;--> statement-breakpoint
DROP TABLE "directus_collections" CASCADE;--> statement-breakpoint
DROP TABLE "directus_folders" CASCADE;--> statement-breakpoint
DROP TABLE "directus_users" CASCADE;--> statement-breakpoint
DROP TABLE "directus_roles" CASCADE;--> statement-breakpoint
DROP TABLE "directus_presets" CASCADE;--> statement-breakpoint
DROP TABLE "directus_fields" CASCADE;--> statement-breakpoint
DROP TABLE "directus_relations" CASCADE;--> statement-breakpoint
DROP TABLE "directus_revisions" CASCADE;--> statement-breakpoint
DROP TABLE "directus_sessions" CASCADE;--> statement-breakpoint
DROP TABLE "directus_migrations" CASCADE;--> statement-breakpoint
DROP TABLE "directus_translations" CASCADE;--> statement-breakpoint
DROP TABLE "directus_operations" CASCADE;--> statement-breakpoint
DROP TABLE "directus_webhooks" CASCADE;--> statement-breakpoint
DROP TABLE "directus_versions" CASCADE;--> statement-breakpoint
DROP TABLE "directus_panels" CASCADE;--> statement-breakpoint
DROP TABLE "directus_dashboards" CASCADE;--> statement-breakpoint
DROP TABLE "directus_notifications" CASCADE;--> statement-breakpoint
DROP TABLE "directus_shares" CASCADE;--> statement-breakpoint
DROP TABLE "directus_flows" CASCADE;--> statement-breakpoint
DROP TABLE "directus_settings" CASCADE;--> statement-breakpoint
DROP TABLE "directus_extensions" CASCADE;--> statement-breakpoint
DROP TABLE "directus_policies" CASCADE;--> statement-breakpoint
DROP TABLE "directus_access" CASCADE;--> statement-breakpoint
DROP TABLE "directus_comments" CASCADE;--> statement-breakpoint
ALTER TABLE "wiki" DROP CONSTRAINT "wiki_slug_key";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_name_key";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_slug_key";--> statement-breakpoint
ALTER TABLE "authors" DROP CONSTRAINT "authors_slug_key";--> statement-breakpoint
ALTER TABLE "news" DROP CONSTRAINT "news_slug_key";--> statement-breakpoint
CREATE INDEX "wiki_slug_key" ON "wiki" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_name_key" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "categories_slug_key" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "authors_slug_key" ON "authors" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "news_slug_key" ON "news" USING btree ("slug");