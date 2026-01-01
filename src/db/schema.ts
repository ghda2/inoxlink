import { pgTable, index, serial, varchar, timestamp, text, foreignKey, jsonb, boolean, integer, uuid } from "drizzle-orm/pg-core"

export const categories = pgTable("categories", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 100 }).notNull(),
    slug: varchar({ length: 100 }).notNull(),
    description: text(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
    index("categories_name_key").on(table.name),
    index("categories_slug_key").on(table.slug),
]);

export const authors = pgTable("authors", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 100 }).notNull(),
    slug: varchar({ length: 100 }).notNull(),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    bio: text(),
    socialLinks: jsonb("social_links"),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
    index("authors_slug_key").on(table.slug),
]);

export const news = pgTable("news", {
    id: serial().primaryKey().notNull(),
    title: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull(),
    content: text().notNull(),
    excerpt: text(),
    imageUrl: varchar("image_url", { length: 500 }),
    categoryId: integer("category_id"),
    authorId: integer("author_id"),
    featuredLevel: integer("featured_level").default(0),
    published: boolean().default(false),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    keywords: text(),
    canonicalUrl: varchar("canonical_url", { length: 500 }),
    ogTitle: varchar("og_title", { length: 255 }),
    ogDescription: text("og_description"),
    ogImage: varchar("og_image", { length: 500 }),
    twitterCard: varchar("twitter_card", { length: 50 }).default('summary_large_image'),
    tags: jsonb(),
    structuredData: jsonb("structured_data"),
    readingTime: integer("reading_time"),
    imageAlt: varchar("image_alt", { length: 255 }),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
    publishedAt: timestamp("published_at", { mode: 'string' }),
    lastModified: timestamp("last_modified", { mode: 'string' }),
    capaNova: uuid("capa_nova"),
}, (table) => [
    index("idx_news_category").using("btree", table.categoryId.asc().nullsLast().op("int4_ops")),
    index("idx_news_published").using("btree", table.published.asc().nullsLast().op("bool_ops")),
    index("idx_news_slug").using("btree", table.slug.asc().nullsLast().op("text_ops")),
    index("idx_news_tags").using("gin", table.tags.asc().nullsLast().op("jsonb_ops")),
    foreignKey({
        columns: [table.categoryId],
        foreignColumns: [categories.id],
        name: "news_category_id_fkey"
    }).onDelete("set null"),
    foreignKey({
        columns: [table.authorId],
        foreignColumns: [authors.id],
        name: "news_author_id_fkey"
    }).onDelete("set null"),
    index("news_slug_key").on(table.slug),
]);

export const wiki = pgTable("wiki", {
    id: serial().primaryKey().notNull(),
    title: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull(),
    content: text().notNull(),
    authorId: integer("author_id"),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    tags: jsonb(),
    structuredData: jsonb("structured_data"),
    ogImage: varchar("og_image", { length: 500 }),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
    foreignKey({
        columns: [table.authorId],
        foreignColumns: [authors.id],
        name: "wiki_author_id_fkey"
    }).onDelete("set null"),
    index("wiki_slug_key").on(table.slug),
]);
