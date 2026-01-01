# 🚀 Passo a passo SPRINT: Portal de Notícias

# Sobre o site:
    Nome: Inox Link
    Estilo: Glass, moderno, limpo
    Tema: Noticias / Wiki
    Cores Principais: Preto e escalar de cinza, com o fundo em branco e preto para os textos

## SPRINT 1: Setup Inicial (Concluído ✅)

```bash
# Comandos executados:
npx create-astro@latest ./ --install --no-git --typescript strict --yes
npx astro add tailwind vercel --yes
```

---

## SPRINT 2: Database Neon (2min)

1. Acesse [neon.tech](https://neon.tech) → Login GitHub
2. Create Project → `portal-noticias`
3. **Copie a connection string**

---

## SPRINT 3: Instalar Drizzle (1min)

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit dotenv
```

---

## SPRINT 4: Configuração (.env + configs) (2min)

1. Criar `.env` → colar connection string
2. Criar `.env.example`
3. Adicionar `.env` no `.gitignore`
4. Criar `drizzle.config.ts`
5. Criar `src/db/schema.ts` (tabela noticias)
6. Criar `src/db/index.ts` (conexão)

---

## SPRINT 5: Criar tabelas no banco (1min)

```bash
npx drizzle-kit generate:pg
npx drizzle-kit push:pg
```

---

## SPRINT 6: Configurar Astro (1min)

1. Editar `astro.config.mjs` → adicionar output: 'hybrid'

---

## SPRINT 7: Criar páginas (3min)

1. Criar `src/layouts/Layout.astro` (layout base)
2. Editar `src/pages/index.astro` (lista de notícias)
3. Criar `src/pages/noticias/[slug].astro` (página individual)

---

## SPRINT 8: Adicionar dados exemplo (2min)

1. Criar `src/scripts/seed.ts`
2. Executar: `npx tsx src/scripts/seed.ts`

---

## SPRINT 9: Git (1min)

```bash
git add .
git commit -m "Initial commit"
gh repo create portal-noticias --public --source=. --push
```

---

## SPRINT 10: Deploy Vercel (2min)

1. Acesse [vercel.com](https://vercel.com) → Login GitHub
2. Import Project → selecionar `portal-noticias`
3. Add Environment Variable: `DATABASE_URL`
4. Deploy

---

## ✅ Total: ~15 minutos

**Resultado:** Portal no ar com banco de dados funcionando

**Quer os códigos de alguma sprint específica?** Só me dizer qual!