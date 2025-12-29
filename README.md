Inox Link - Portal de Notícias (Plano Mestre)

1. Visão Geral

O Inox Link é um portal de notícias moderno e de alto desempenho, desenvolvido com foco em SEO, integridade de dados e escalabilidade. O projeto utiliza Next.js (App Router) para renderização do lado do servidor (SSR), garantindo indexação perfeita e performance de ponta.

Diferente da versão inicial, este plano contempla uma arquitetura de dados normalizada (com tabela de autores dedicada) e otimizações específicas para o PostgreSQL (índices e JSONB), além de utilizar as APIs mais recentes do Next.js para metadados.

2. Stack Tecnológica Definida

Core: Next.js 14/15 (App Router).

Linguagem: TypeScript.

Estilização: Tailwind CSS + Shadcn/ui (Radix UI).

Banco de Dados: PostgreSQL (hospedado no Neon.tech).

Driver de BD: pg (node-postgres) ou Drizzle ORM (recomendado para type-safety).

Imagens: Cloudinary (Upload e otimização).

SEO: Next.js Metadata API (nativa).

Estado/Formulários: Zustand, React Hook Form, Zod.

Qualidade: ESLint, Prettier, Husky.

3. Planejamento do Banco de Dados (Otimizado)

Estrutura de dados normalizada com suporte a SEO avançado e campos flexíveis via JSONB.

Scripts SQL (Neon.tech / PostgreSQL)

-- 1. Tabela de Autores (Essencial para E-E-A-T)
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  avatar_url VARCHAR(500),
  bio TEXT,
  social_links JSONB, -- Ex: {"twitter": "...", "linkedin": "..."}
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Tabela de Categorias
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Tabela de Notícias (Principal)
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url VARCHAR(500),
  
  -- Relacionamentos
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  author_id INTEGER REFERENCES authors(id) ON DELETE SET NULL,
  
  -- Controle de Exibição
  featured_level INTEGER DEFAULT 0, -- 0=padrão, 1=principal, 2=secundário
  published BOOLEAN DEFAULT FALSE,
  
  -- SEO Avançado & Metadados
  meta_title VARCHAR(255),
  meta_description TEXT,
  keywords TEXT, 
  canonical_url VARCHAR(500),
  
  -- Open Graph (Social Media)
  og_title VARCHAR(255),
  og_description TEXT,
  og_image VARCHAR(500),
  twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
  
  -- Dados Técnicos
  tags JSONB, -- Permite indexação e busca rápida (GIN index)
  structured_data JSONB, -- Schema markup (JSON-LD)
  reading_time INTEGER,
  image_alt VARCHAR(255),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  last_modified TIMESTAMP
);

-- 4. Tabela Wiki (Conteúdo Evergreen)
CREATE TABLE wiki (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER REFERENCES authors(id) ON DELETE SET NULL,
  
  -- SEO & Metadados
  meta_title VARCHAR(255),
  meta_description TEXT,
  tags JSONB,
  structured_data JSONB,
  og_image VARCHAR(500),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Índices de Performance
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_published ON news(published);
CREATE INDEX idx_news_category ON news(category_id);
CREATE INDEX idx_news_tags ON news USING GIN (tags); 


4. Estrutura do Projeto (App Router)

site_final/
├── app/                        # App Router
│   ├── layout.tsx              # Layout raiz
│   ├── page.tsx                # Home (Lista de news)
│   ├── news/
│   │   └── [slug]/             
│   │       ├── page.tsx        # Página do artigo (Server Component)
│   │       └── layout.tsx      # Layout específico
│   ├── api/                    # Route Handlers
│   │   └── revalidate/         # Webhook para on-demand ISR
│   └── admin/                  # Dashboard administrativo
├── components/
│   ├── ui/                     # Shadcn components
│   ├── news-card.tsx           # Card de listagem
│   └── structured-data.tsx     # Injeção de JSON-LD
├── lib/
│   ├── db.ts                   # Cliente Postgres / Drizzle
│   └── utils.ts                # Helpers (cn, dates)
├── types/                      # Definições TS
└── public/                     # Assets estáticos


5. Guia de Implementação de SEO (Next.js 14+)

Geração de Metadados Dinâmicos

Arquivo: app/news/[slug]/page.tsx

import { Metadata } from 'next';
import { db } from '@/lib/db';

type Props = {
  params: { slug: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await db.query(
    `SELECT title, meta_title, excerpt, meta_description, 
            og_image, image_url, canonical_url 
     FROM news WHERE slug = $1`, 
    [params.slug]
  );
  const post = result.rows[0];

  if (!post) return { title: 'Notícia não encontrada' };

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.og_title || post.meta_title || post.title,
      description: post.og_description || post.meta_description || post.excerpt,
      images: [post.og_image || post.image_url],
      type: 'article',
    },
    alternates: {
      canonical: post.canonical_url || `https://inoxlink.com/news/${params.slug}`,
    }
  };
}


Dados Estruturados (JSON-LD)

Injeção direta no componente de página para Rich Snippets:

export default async function NewsPage({ params }: Props) {
  const post = await getPostData(params.slug);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(post.structured_data) }}
      />
      <h1>{post.title}</h1>
      {/* Conteúdo do Artigo */}
    </article>
  );
}


6. Fluxo de Desenvolvimento

Configuração Inicial:

npx create-next-app@latest site_final --typescript --tailwind --eslint

Instalar: npm install pg @types/pg lucide-react date-fns

Banco de Dados:

Criar projeto no Neon.tech.

Rodar scripts SQL da Seção 3.

Configurar DATABASE_URL no .env.

Core Components:

npx shadcn-ui@latest init

Criar Header, Footer e NewsCard.

Páginas:

Home (app/page.tsx) com fetch das notícias.

Detalhes (app/news/[slug]/page.tsx) com metadados.

Admin:

Rota /admin protegida para CRUD de notícias e categorias.

7. Próximos Passos

[ ] Implementar conexão em lib/db.ts.

[ ] Criar componentes base de layout.

[ ] Popular banco com dados fictícios para teste de SEO.