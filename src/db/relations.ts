import { relations } from "drizzle-orm/relations";
import { authors, wiki, categories, news } from "./schema";

export const wikiRelations = relations(wiki, ({ one }) => ({
	author: one(authors, {
		fields: [wiki.authorId],
		references: [authors.id]
	}),
}));

export const authorsRelations = relations(authors, ({ many }) => ({
	wikis: many(wiki),
	news: many(news),
}));

export const newsRelations = relations(news, ({ one }) => ({
	category: one(categories, {
		fields: [news.categoryId],
		references: [categories.id]
	}),
	author: one(authors, {
		fields: [news.authorId],
		references: [authors.id]
	}),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
	news: many(news),
}));