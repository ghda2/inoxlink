const { Pool } = require('pg');
require('dotenv').config();

async function createTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const queries = [
    `CREATE SCHEMA IF NOT EXISTS public;`,
    `CREATE TABLE IF NOT EXISTS public.authors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL UNIQUE,
      avatar_url VARCHAR(500),
      bio TEXT,
      social_links JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    );`,
    `CREATE TABLE IF NOT EXISTS public.categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      slug VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );`,
    `CREATE TABLE IF NOT EXISTS public.news (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      image_url VARCHAR(500),
      category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
      author_id INTEGER REFERENCES public.authors(id) ON DELETE SET NULL,
      featured_level INTEGER DEFAULT 0,
      published BOOLEAN DEFAULT FALSE,
      meta_title VARCHAR(255),
      meta_description TEXT,
      keywords TEXT,
      canonical_url VARCHAR(500),
      og_title VARCHAR(255),
      og_description TEXT,
      og_image VARCHAR(500),
      twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
      tags JSONB,
      structured_data JSONB,
      reading_time INTEGER,
      image_alt VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      published_at TIMESTAMP,
      last_modified TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS public.wiki (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER REFERENCES public.authors(id) ON DELETE SET NULL,
      meta_title VARCHAR(255),
      meta_description TEXT,
      tags JSONB,
      structured_data JSONB,
      og_image VARCHAR(500),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );`,
    `CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);`,
    `CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(published);`,
    `CREATE INDEX IF NOT EXISTS idx_news_category ON public.news(category_id);`,
    `CREATE INDEX IF NOT EXISTS idx_news_tags ON public.news USING GIN (tags);`
  ];

  try {
    const client = await pool.connect();
    console.log('Conectado ao banco de dados Neon.');

    for (const query of queries) {
      await client.query(query);
      console.log('Executado:', query.split('\n')[0]);
    }

    console.log('Todas as tabelas e índices criados com sucesso!');
    client.release();
  } catch (err) {
    console.error('Erro ao criar tabelas:', err.message);
  } finally {
    await pool.end();
  }
}

createTables();