import { pgTable, index, serial, varchar, uuid, timestamp, text, foreignKey, json, bigint, integer, boolean, unique, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const directusActivity = pgTable("directus_activity", {
	id: serial().primaryKey().notNull(),
	action: varchar({ length: 45 }).notNull(),
	user: uuid(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	ip: varchar({ length: 50 }),
	userAgent: text("user_agent"),
	collection: varchar({ length: 64 }).notNull(),
	item: varchar({ length: 255 }).notNull(),
	origin: varchar({ length: 255 }),
}, (table) => [
	index().using("btree", table.timestamp.asc().nullsLast().op("timestamptz_ops")),
]);

export const directusPermissions = pgTable("directus_permissions", {
	id: serial().primaryKey().notNull(),
	collection: varchar({ length: 64 }).notNull(),
	action: varchar({ length: 10 }).notNull(),
	permissions: json(),
	validation: json(),
	presets: json(),
	fields: text(),
	policy: uuid().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.policy],
			foreignColumns: [directusPolicies.id],
			name: "directus_permissions_policy_foreign"
		}).onDelete("cascade"),
]);

export const directusFiles = pgTable("directus_files", {
	id: uuid().primaryKey().notNull(),
	storage: varchar({ length: 255 }).notNull(),
	filenameDisk: varchar("filename_disk", { length: 255 }),
	filenameDownload: varchar("filename_download", { length: 255 }).notNull(),
	title: varchar({ length: 255 }),
	type: varchar({ length: 255 }),
	folder: uuid(),
	uploadedBy: uuid("uploaded_by"),
	createdOn: timestamp("created_on", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	modifiedBy: uuid("modified_by"),
	modifiedOn: timestamp("modified_on", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	charset: varchar({ length: 50 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	filesize: bigint({ mode: "number" }),
	width: integer(),
	height: integer(),
	duration: integer(),
	embed: varchar({ length: 200 }),
	description: text(),
	location: text(),
	tags: text(),
	metadata: json(),
	focalPointX: integer("focal_point_x"),
	focalPointY: integer("focal_point_y"),
	tusId: varchar("tus_id", { length: 64 }),
	tusData: json("tus_data"),
	uploadedOn: timestamp("uploaded_on", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.uploadedBy],
			foreignColumns: [directusUsers.id],
			name: "directus_files_uploaded_by_foreign"
		}),
	foreignKey({
			columns: [table.modifiedBy],
			foreignColumns: [directusUsers.id],
			name: "directus_files_modified_by_foreign"
		}),
	foreignKey({
			columns: [table.folder],
			foreignColumns: [directusFolders.id],
			name: "directus_files_folder_foreign"
		}).onDelete("set null"),
]);

export const directusCollections = pgTable("directus_collections", {
	collection: varchar({ length: 64 }).primaryKey().notNull(),
	icon: varchar({ length: 64 }),
	note: text(),
	displayTemplate: varchar("display_template", { length: 255 }),
	hidden: boolean().default(false).notNull(),
	singleton: boolean().default(false).notNull(),
	translations: json(),
	archiveField: varchar("archive_field", { length: 64 }),
	archiveAppFilter: boolean("archive_app_filter").default(true).notNull(),
	archiveValue: varchar("archive_value", { length: 255 }),
	unarchiveValue: varchar("unarchive_value", { length: 255 }),
	sortField: varchar("sort_field", { length: 64 }),
	accountability: varchar({ length: 255 }).default('all'),
	color: varchar({ length: 255 }),
	itemDuplicationFields: json("item_duplication_fields"),
	sort: integer(),
	group: varchar({ length: 64 }),
	collapse: varchar({ length: 255 }).default('open').notNull(),
	previewUrl: varchar("preview_url", { length: 255 }),
	versioning: boolean().default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.group],
			foreignColumns: [table.collection],
			name: "directus_collections_group_foreign"
		}),
]);

export const directusFolders = pgTable("directus_folders", {
	id: uuid().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	parent: uuid(),
}, (table) => [
	foreignKey({
			columns: [table.parent],
			foreignColumns: [table.id],
			name: "directus_folders_parent_foreign"
		}),
]);

export const directusUsers = pgTable("directus_users", {
	id: uuid().primaryKey().notNull(),
	firstName: varchar("first_name", { length: 50 }),
	lastName: varchar("last_name", { length: 50 }),
	email: varchar({ length: 128 }),
	password: varchar({ length: 255 }),
	location: varchar({ length: 255 }),
	title: varchar({ length: 50 }),
	description: text(),
	tags: json(),
	avatar: uuid(),
	language: varchar({ length: 255 }).default(sql`NULL`),
	tfaSecret: varchar("tfa_secret", { length: 255 }),
	status: varchar({ length: 16 }).default('active').notNull(),
	role: uuid(),
	token: varchar({ length: 255 }),
	lastAccess: timestamp("last_access", { withTimezone: true, mode: 'string' }),
	lastPage: varchar("last_page", { length: 255 }),
	provider: varchar({ length: 128 }).default('default').notNull(),
	externalIdentifier: varchar("external_identifier", { length: 255 }),
	authData: json("auth_data"),
	emailNotifications: boolean("email_notifications").default(true),
	appearance: varchar({ length: 255 }),
	themeDark: varchar("theme_dark", { length: 255 }),
	themeLight: varchar("theme_light", { length: 255 }),
	themeLightOverrides: json("theme_light_overrides"),
	themeDarkOverrides: json("theme_dark_overrides"),
	textDirection: varchar("text_direction", { length: 255 }).default('auto').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.role],
			foreignColumns: [directusRoles.id],
			name: "directus_users_role_foreign"
		}).onDelete("set null"),
	unique("directus_users_email_unique").on(table.email),
	unique("directus_users_token_unique").on(table.token),
	unique("directus_users_external_identifier_unique").on(table.externalIdentifier),
]);

export const directusRoles = pgTable("directus_roles", {
	id: uuid().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	icon: varchar({ length: 64 }).default('supervised_user_circle').notNull(),
	description: text(),
	parent: uuid(),
}, (table) => [
	foreignKey({
			columns: [table.parent],
			foreignColumns: [table.id],
			name: "directus_roles_parent_foreign"
		}),
]);

export const directusPresets = pgTable("directus_presets", {
	id: serial().primaryKey().notNull(),
	bookmark: varchar({ length: 255 }),
	user: uuid(),
	role: uuid(),
	collection: varchar({ length: 64 }),
	search: varchar({ length: 100 }),
	layout: varchar({ length: 100 }).default('tabular'),
	layoutQuery: json("layout_query"),
	layoutOptions: json("layout_options"),
	refreshInterval: integer("refresh_interval"),
	filter: json(),
	icon: varchar({ length: 64 }).default('bookmark'),
	color: varchar({ length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.user],
			foreignColumns: [directusUsers.id],
			name: "directus_presets_user_foreign"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.role],
			foreignColumns: [directusRoles.id],
			name: "directus_presets_role_foreign"
		}).onDelete("cascade"),
]);

export const directusFields = pgTable("directus_fields", {
	id: serial().primaryKey().notNull(),
	collection: varchar({ length: 64 }).notNull(),
	field: varchar({ length: 64 }).notNull(),
	special: varchar({ length: 64 }),
	interface: varchar({ length: 64 }),
	options: json(),
	display: varchar({ length: 64 }),
	displayOptions: json("display_options"),
	readonly: boolean().default(false).notNull(),
	hidden: boolean().default(false).notNull(),
	sort: integer(),
	width: varchar({ length: 30 }).default('full'),
	translations: json(),
	note: text(),
	conditions: json(),
	required: boolean().default(false),
	group: varchar({ length: 64 }),
	validation: json(),
	validationMessage: text("validation_message"),
	searchable: boolean().default(true).notNull(),
});

export const directusRelations = pgTable("directus_relations", {
	id: serial().primaryKey().notNull(),
	manyCollection: varchar("many_collection", { length: 64 }).notNull(),
	manyField: varchar("many_field", { length: 64 }).notNull(),
	oneCollection: varchar("one_collection", { length: 64 }),
	oneField: varchar("one_field", { length: 64 }),
	oneCollectionField: varchar("one_collection_field", { length: 64 }),
	oneAllowedCollections: text("one_allowed_collections"),
	junctionField: varchar("junction_field", { length: 64 }),
	sortField: varchar("sort_field", { length: 64 }),
	oneDeselectAction: varchar("one_deselect_action", { length: 255 }).default('nullify').notNull(),
});

export const directusRevisions = pgTable("directus_revisions", {
	id: serial().primaryKey().notNull(),
	activity: integer().notNull(),
	collection: varchar({ length: 64 }).notNull(),
	item: varchar({ length: 255 }).notNull(),
	data: json(),
	delta: json(),
	parent: integer(),
	version: uuid(),
}, (table) => [
	index().using("btree", table.parent.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.parent],
			foreignColumns: [table.id],
			name: "directus_revisions_parent_foreign"
		}),
	foreignKey({
			columns: [table.activity],
			foreignColumns: [directusActivity.id],
			name: "directus_revisions_activity_foreign"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.version],
			foreignColumns: [directusVersions.id],
			name: "directus_revisions_version_foreign"
		}).onDelete("cascade"),
]);

export const directusSessions = pgTable("directus_sessions", {
	token: varchar({ length: 64 }).primaryKey().notNull(),
	user: uuid(),
	expires: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	ip: varchar({ length: 255 }),
	userAgent: text("user_agent"),
	share: uuid(),
	origin: varchar({ length: 255 }),
	nextToken: varchar("next_token", { length: 64 }),
}, (table) => [
	foreignKey({
			columns: [table.user],
			foreignColumns: [directusUsers.id],
			name: "directus_sessions_user_foreign"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.share],
			foreignColumns: [directusShares.id],
			name: "directus_sessions_share_foreign"
		}).onDelete("cascade"),
]);

export const directusMigrations = pgTable("directus_migrations", {
	version: varchar({ length: 255 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const directusTranslations = pgTable("directus_translations", {
	id: uuid().primaryKey().notNull(),
	language: varchar({ length: 255 }).notNull(),
	key: varchar({ length: 255 }).notNull(),
	value: text().notNull(),
});

export const directusOperations = pgTable("directus_operations", {
	id: uuid().primaryKey().notNull(),
	name: varchar({ length: 255 }),
	key: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 255 }).notNull(),
	positionX: integer("position_x").notNull(),
	positionY: integer("position_y").notNull(),
	options: json(),
	resolve: uuid(),
	reject: uuid(),
	flow: uuid().notNull(),
	dateCreated: timestamp("date_created", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	userCreated: uuid("user_created"),
}, (table) => [
	foreignKey({
			columns: [table.resolve],
			foreignColumns: [table.id],
			name: "directus_operations_resolve_foreign"
		}),
	foreignKey({
			columns: [table.reject],
			foreignColumns: [table.id],
			name: "directus_operations_reject_foreign"
		}),
	foreignKey({
			columns: [table.flow],
			foreignColumns: [directusFlows.id],
			name: "directus_operations_flow_foreign"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userCreated],
			foreignColumns: [directusUsers.id],
			name: "directus_operations_user_created_foreign"
		}).onDelete("set null"),
	unique("directus_operations_resolve_unique").on(table.resolve),
	unique("directus_operations_reject_unique").on(table.reject),
]);

export const directusWebhooks = pgTable("directus_webhooks", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	method: varchar({ length: 10 }).default('POST').notNull(),
	url: varchar({ length: 255 }).notNull(),
	status: varchar({ length: 10 }).default('active').notNull(),
	data: boolean().default(true).notNull(),
	actions: varchar({ length: 100 }).notNull(),
	collections: varchar({ length: 255 }).notNull(),
	headers: json(),
	wasActiveBeforeDeprecation: boolean("was_active_before_deprecation").default(false).notNull(),
	migratedFlow: uuid("migrated_flow"),
}, (table) => [
	foreignKey({
			columns: [table.migratedFlow],
			foreignColumns: [directusFlows.id],
			name: "directus_webhooks_migrated_flow_foreign"
		}).onDelete("set null"),
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
	unique("wiki_slug_key").on(table.slug),
]);

export const directusVersions = pgTable("directus_versions", {
	id: uuid().primaryKey().notNull(),
	key: varchar({ length: 64 }).notNull(),
	name: varchar({ length: 255 }),
	collection: varchar({ length: 64 }).notNull(),
	item: varchar({ length: 255 }).notNull(),
	hash: varchar({ length: 255 }),
	dateCreated: timestamp("date_created", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	dateUpdated: timestamp("date_updated", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	userCreated: uuid("user_created"),
	userUpdated: uuid("user_updated"),
	delta: json(),
}, (table) => [
	foreignKey({
			columns: [table.collection],
			foreignColumns: [directusCollections.collection],
			name: "directus_versions_collection_foreign"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userCreated],
			foreignColumns: [directusUsers.id],
			name: "directus_versions_user_created_foreign"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.userUpdated],
			foreignColumns: [directusUsers.id],
			name: "directus_versions_user_updated_foreign"
		}),
]);

export const directusPanels = pgTable("directus_panels", {
	id: uuid().primaryKey().notNull(),
	dashboard: uuid().notNull(),
	name: varchar({ length: 255 }),
	icon: varchar({ length: 64 }).default(sql`NULL`),
	color: varchar({ length: 10 }),
	showHeader: boolean("show_header").default(false).notNull(),
	note: text(),
	type: varchar({ length: 255 }).notNull(),
	positionX: integer("position_x").notNull(),
	positionY: integer("position_y").notNull(),
	width: integer().notNull(),
	height: integer().notNull(),
	options: json(),
	dateCreated: timestamp("date_created", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	userCreated: uuid("user_created"),
}, (table) => [
	foreignKey({
			columns: [table.dashboard],
			foreignColumns: [directusDashboards.id],
			name: "directus_panels_dashboard_foreign"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userCreated],
			foreignColumns: [directusUsers.id],
			name: "directus_panels_user_created_foreign"
		}).onDelete("set null"),
]);

export const categories = pgTable("categories", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	slug: varchar({ length: 100 }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("categories_name_key").on(table.name),
	unique("categories_slug_key").on(table.slug),
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
	unique("authors_slug_key").on(table.slug),
]);

export const directusDashboards = pgTable("directus_dashboards", {
	id: uuid().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	icon: varchar({ length: 64 }).default('dashboard').notNull(),
	note: text(),
	dateCreated: timestamp("date_created", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	userCreated: uuid("user_created"),
	color: varchar({ length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.userCreated],
			foreignColumns: [directusUsers.id],
			name: "directus_dashboards_user_created_foreign"
		}).onDelete("set null"),
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
	unique("news_slug_key").on(table.slug),
]);

export const directusNotifications = pgTable("directus_notifications", {
	id: serial().primaryKey().notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	status: varchar({ length: 255 }).default('inbox'),
	recipient: uuid().notNull(),
	sender: uuid(),
	subject: varchar({ length: 255 }).notNull(),
	message: text(),
	collection: varchar({ length: 64 }),
	item: varchar({ length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.recipient],
			foreignColumns: [directusUsers.id],
			name: "directus_notifications_recipient_foreign"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.sender],
			foreignColumns: [directusUsers.id],
			name: "directus_notifications_sender_foreign"
		}),
]);

export const directusShares = pgTable("directus_shares", {
	id: uuid().primaryKey().notNull(),
	name: varchar({ length: 255 }),
	collection: varchar({ length: 64 }).notNull(),
	item: varchar({ length: 255 }).notNull(),
	role: uuid(),
	password: varchar({ length: 255 }),
	userCreated: uuid("user_created"),
	dateCreated: timestamp("date_created", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	dateStart: timestamp("date_start", { withTimezone: true, mode: 'string' }),
	dateEnd: timestamp("date_end", { withTimezone: true, mode: 'string' }),
	timesUsed: integer("times_used").default(0),
	maxUses: integer("max_uses"),
}, (table) => [
	foreignKey({
			columns: [table.collection],
			foreignColumns: [directusCollections.collection],
			name: "directus_shares_collection_foreign"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.role],
			foreignColumns: [directusRoles.id],
			name: "directus_shares_role_foreign"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userCreated],
			foreignColumns: [directusUsers.id],
			name: "directus_shares_user_created_foreign"
		}).onDelete("set null"),
]);

export const directusFlows = pgTable("directus_flows", {
	id: uuid().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	icon: varchar({ length: 64 }),
	color: varchar({ length: 255 }),
	description: text(),
	status: varchar({ length: 255 }).default('active').notNull(),
	trigger: varchar({ length: 255 }),
	accountability: varchar({ length: 255 }).default('all'),
	options: json(),
	operation: uuid(),
	dateCreated: timestamp("date_created", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	userCreated: uuid("user_created"),
}, (table) => [
	foreignKey({
			columns: [table.userCreated],
			foreignColumns: [directusUsers.id],
			name: "directus_flows_user_created_foreign"
		}).onDelete("set null"),
	unique("directus_flows_operation_unique").on(table.operation),
]);

export const directusSettings = pgTable("directus_settings", {
	id: serial().primaryKey().notNull(),
	projectName: varchar("project_name", { length: 100 }).default('Directus').notNull(),
	projectUrl: varchar("project_url", { length: 255 }),
	projectColor: varchar("project_color", { length: 255 }).default('#6644FF').notNull(),
	projectLogo: uuid("project_logo"),
	publicForeground: uuid("public_foreground"),
	publicBackground: uuid("public_background"),
	publicNote: text("public_note"),
	authLoginAttempts: integer("auth_login_attempts").default(25),
	authPasswordPolicy: varchar("auth_password_policy", { length: 100 }),
	storageAssetTransform: varchar("storage_asset_transform", { length: 7 }).default('all'),
	storageAssetPresets: json("storage_asset_presets"),
	customCss: text("custom_css"),
	storageDefaultFolder: uuid("storage_default_folder"),
	basemaps: json(),
	mapboxKey: varchar("mapbox_key", { length: 255 }),
	moduleBar: json("module_bar"),
	projectDescriptor: varchar("project_descriptor", { length: 100 }),
	defaultLanguage: varchar("default_language", { length: 255 }).default('en-US').notNull(),
	customAspectRatios: json("custom_aspect_ratios"),
	publicFavicon: uuid("public_favicon"),
	defaultAppearance: varchar("default_appearance", { length: 255 }).default('auto').notNull(),
	defaultThemeLight: varchar("default_theme_light", { length: 255 }),
	themeLightOverrides: json("theme_light_overrides"),
	defaultThemeDark: varchar("default_theme_dark", { length: 255 }),
	themeDarkOverrides: json("theme_dark_overrides"),
	reportErrorUrl: varchar("report_error_url", { length: 255 }),
	reportBugUrl: varchar("report_bug_url", { length: 255 }),
	reportFeatureUrl: varchar("report_feature_url", { length: 255 }),
	publicRegistration: boolean("public_registration").default(false).notNull(),
	publicRegistrationVerifyEmail: boolean("public_registration_verify_email").default(true).notNull(),
	publicRegistrationRole: uuid("public_registration_role"),
	publicRegistrationEmailFilter: json("public_registration_email_filter"),
	visualEditorUrls: json("visual_editor_urls"),
	projectId: uuid("project_id"),
	mcpEnabled: boolean("mcp_enabled").default(false).notNull(),
	mcpAllowDeletes: boolean("mcp_allow_deletes").default(false).notNull(),
	mcpPromptsCollection: varchar("mcp_prompts_collection", { length: 255 }).default(sql`NULL`),
	mcpSystemPromptEnabled: boolean("mcp_system_prompt_enabled").default(true).notNull(),
	mcpSystemPrompt: text("mcp_system_prompt"),
	projectOwner: varchar("project_owner", { length: 255 }),
	projectUsage: varchar("project_usage", { length: 255 }),
	orgName: varchar("org_name", { length: 255 }),
	productUpdates: boolean("product_updates"),
	projectStatus: varchar("project_status", { length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.projectLogo],
			foreignColumns: [directusFiles.id],
			name: "directus_settings_project_logo_foreign"
		}),
	foreignKey({
			columns: [table.publicForeground],
			foreignColumns: [directusFiles.id],
			name: "directus_settings_public_foreground_foreign"
		}),
	foreignKey({
			columns: [table.publicBackground],
			foreignColumns: [directusFiles.id],
			name: "directus_settings_public_background_foreign"
		}),
	foreignKey({
			columns: [table.storageDefaultFolder],
			foreignColumns: [directusFolders.id],
			name: "directus_settings_storage_default_folder_foreign"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.publicFavicon],
			foreignColumns: [directusFiles.id],
			name: "directus_settings_public_favicon_foreign"
		}),
	foreignKey({
			columns: [table.publicRegistrationRole],
			foreignColumns: [directusRoles.id],
			name: "directus_settings_public_registration_role_foreign"
		}).onDelete("set null"),
]);

export const directusExtensions = pgTable("directus_extensions", {
	enabled: boolean().default(true).notNull(),
	id: uuid().primaryKey().notNull(),
	folder: varchar({ length: 255 }).notNull(),
	source: varchar({ length: 255 }).notNull(),
	bundle: uuid(),
});

export const directusPolicies = pgTable("directus_policies", {
	id: uuid().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	icon: varchar({ length: 64 }).default('badge').notNull(),
	description: text(),
	ipAccess: text("ip_access"),
	enforceTfa: boolean("enforce_tfa").default(false).notNull(),
	adminAccess: boolean("admin_access").default(false).notNull(),
	appAccess: boolean("app_access").default(false).notNull(),
});

export const directusAccess = pgTable("directus_access", {
	id: uuid().primaryKey().notNull(),
	role: uuid(),
	user: uuid(),
	policy: uuid().notNull(),
	sort: integer(),
}, (table) => [
	foreignKey({
			columns: [table.role],
			foreignColumns: [directusRoles.id],
			name: "directus_access_role_foreign"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.user],
			foreignColumns: [directusUsers.id],
			name: "directus_access_user_foreign"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.policy],
			foreignColumns: [directusPolicies.id],
			name: "directus_access_policy_foreign"
		}).onDelete("cascade"),
]);

export const directusComments = pgTable("directus_comments", {
	id: uuid().primaryKey().notNull(),
	collection: varchar({ length: 64 }).notNull(),
	item: varchar({ length: 255 }).notNull(),
	comment: text().notNull(),
	dateCreated: timestamp("date_created", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	dateUpdated: timestamp("date_updated", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	userCreated: uuid("user_created"),
	userUpdated: uuid("user_updated"),
}, (table) => [
	foreignKey({
			columns: [table.userCreated],
			foreignColumns: [directusUsers.id],
			name: "directus_comments_user_created_foreign"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.userUpdated],
			foreignColumns: [directusUsers.id],
			name: "directus_comments_user_updated_foreign"
		}),
]);
