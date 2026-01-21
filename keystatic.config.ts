import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: process.env.NODE_ENV === 'production' 
    ? { kind: 'github', repo: 'ghda2/inoxlink' }
    : { kind: 'local' },
  
  collections: {
    news: collection({
      label: 'Notícias/Matérias',
      slugField: 'title',
      path: 'src/content/news/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        publishedAt: fields.date({ label: 'Data de Publicação', defaultValue: { kind: 'today' } }),
        isPublished: fields.checkbox({ label: 'Publicado', defaultValue: true }),
        coverImage: fields.image({
          label: 'Imagem de Capa',
          directory: 'public/content/news',
          publicPath: '/content/news/',
        }),
        author: fields.relationship({
          label: 'Autor',
          collection: 'authors',
        }),
        category: fields.relationship({
          label: 'Categoria',
          collection: 'categories',
        }),
        excerpt: fields.text({ label: 'Resumo (Snippet)', multiline: true }),
        content: fields.markdoc({ 
          label: 'Conteúdo da Matéria',
          options: {
            image: {
              directory: 'public/content/news',
              publicPath: '/content/news/',
            }
          }
        }),
      },
    }),
    
    authors: collection({
      label: 'Autores',
      slugField: 'name',
      path: 'src/content/authors/*',
      schema: {
        name: fields.slug({ name: { label: 'Nome do Autor' } }),
        avatar: fields.image({
          label: 'Avatar',
          directory: 'public/content/authors',
          publicPath: '/content/authors/',
        }),
        bio: fields.text({ label: 'Biografia', multiline: true }),
      },
    }),

    categories: collection({
      label: 'Categorias',
      slugField: 'name',
      path: 'src/content/categories/*',
      schema: {
        name: fields.slug({ name: { label: 'Nome da Categoria' } }),
        description: fields.text({ label: 'Descrição' }),
      },
    }),

    wiki: collection({
      label: 'Wiki / Documentação',
      slugField: 'title',
      path: 'src/content/wiki/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título do Artigo' } }),
        updatedAt: fields.date({ label: 'Última Atualização', defaultValue: { kind: 'today' } }),
        content: fields.markdoc({ 
          label: 'Conteúdo do Artigo',
          options: {
            image: {
              directory: 'public/content/wiki',
              publicPath: '/content/wiki/',
            }
          }
        }),
      },
    }),
  },
});
