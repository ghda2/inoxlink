const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function seed() {
    const client = await pool.connect();

    try {
        console.log('Iniciando o povoamento do banco de dados...');

        // Limpar dados existentes
        console.log('Limpando tabelas...');
        await client.query('TRUNCATE news, wiki, categories, authors CASCADE');

        // 1. Inserir Autores
        console.log('Inserindo autores...');
        const authors = await client.query(`
      INSERT INTO authors (name, slug, bio) VALUES 
      ('Gabriel Santos', 'gabriel-santos', 'Especialista em metalurgia e entusiasta de tecnologia industrial.'),
      ('Mariana Lima', 'mariana-lima', 'Jornalista focada em sustentabilidade e inovação arquitetônica.'),
      ('Redação Inox Link', 'redacao', 'A voz oficial do portal Inox Link, trazendo as notícias mais quentes do setor.')
      RETURNING id, name
    `);

        // 2. Inserir Categorias
        console.log('Inserindo categorias...');
        const categories = await client.query(`
      INSERT INTO categories (name, slug, description) VALUES 
      ('Indústria', 'industria', 'Notícias e avanços nos processos de produção e manufatura.'),
      ('Arquitetura', 'arquitetura', 'O uso do aço inox na construção civil e design de interiores.'),
      ('Tecnologia', 'tecnologia', 'Inovações digitais, IA e automação aplicadas ao setor metalúrgico.'),
      ('Mercado', 'mercado', 'Análises econômicas, tendências de preços e negócios globais.')
      RETURNING id, name
    `);

        const authorMap = authors.rows.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.id }), {});
        const categoryMap = categories.rows.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.id }), {});

        // 3. Inserir Notícias (Uma por uma para evitar erro de parâmetros)
        console.log('Inserindo notícias...');
        const newsData = [
            {
                title: 'O Futuro do Aço Inox na Construção Civil Sustentável',
                slug: 'futuro-aco-inox-contrucao-sustentavel',
                content: '<p>O aço inoxidável está se tornando o protagonista das novas construções sustentáveis. Sua durabilidade extrema e capacidade de ser 100% reciclado o tornam a escolha ideal para projetos que visam a certificação LEED.</p>',
                excerpt: 'Descubra como a durabilidade do aço inox está revolucionando o design sustentável.',
                category: 'Arquitetura', author: 'Mariana Lima'
            },
            {
                title: 'Nova Tecnologia de Impressão 3D em Metal Aumenta Produtividade',
                slug: 'tecnologia-impressao-3d-metal-inox',
                content: '<h2>Inovação na Manufatura</h2><p>Uma nova classe de impressoras 3D industriais agora é capaz de produzir peças complexas de aço inox em uma fração do tempo anterior.</p>',
                excerpt: 'Impressoras 3D de última geração estão criando peças complexas de inox com precisão.',
                category: 'Tecnologia', author: 'Gabriel Santos'
            },
            {
                title: 'Mercado de Ligas Especiais Apresenta Alta de 15% no Último Semestre',
                slug: 'mercado-ligas-especiais-alta-semestre',
                content: '<p>O relatório trimestral do setor metalúrgico indica uma forte recuperação na demanda por aços especiais.</p>',
                excerpt: 'Análise detalhada sobre os motivos da alta do mercado de inox.',
                category: 'Mercado', author: 'Redação Inox Link'
            },
            {
                title: 'Designers Apostam no Inox para Interiores de Luxo em 2026',
                slug: 'design-inox-interiores-luxo-2026',
                content: '<p>Esqueça o visual frio e industrial. O inox com acabamento escovado está invadindo as cozinhas de luxo.</p>',
                excerpt: 'As tendências de design de interiores para o próximo ano colocam o aço inox no topo.',
                category: 'Arquitetura', author: 'Mariana Lima'
            },
            {
                title: 'Como a Inteligência Artificial Está Otimizando a Produção de Ligas',
                slug: 'ia-otimizando-producao-ligas-inox',
                content: '<p>Algoritmos de aprendizado de máquina estão sendo usados para prever a combinação perfeita de elementos químicos.</p>',
                excerpt: 'A convergência entre a metalurgia tradicional e a IA está gerando resultados impressionantes.',
                category: 'Tecnologia', author: 'Gabriel Santos'
            }
        ];

        for (const item of newsData) {
            await client.query(`
        INSERT INTO news (title, slug, content, excerpt, category_id, author_id, published, published_at) 
        VALUES ($1, $2, $3, $4, $5, $6, true, NOW())
      `, [item.title, item.slug, item.content, item.excerpt, categoryMap[item.category], authorMap[item.author]]);
        }

        // 4. Inserir Wiki
        console.log('Inserindo Wiki...');
        const wikiData = [
            {
                title: 'Grau 304 vs Grau 316: Qual a Diferença?',
                slug: 'grau-304-vs-316-diferencas',
                content: '<p>Os aços inox 304 e 316 são os mais comuns...</p>',
                author: 'Redação Inox Link'
            },
            {
                title: 'O Processo de Passivação do Aço Inoxidável',
                slug: 'processo-passivacao-aco-inox',
                content: '<p>A passivação é o tratamento químico que remove ferro livre da superfície...</p>',
                author: 'Gabriel Santos'
            }
        ];

        for (const item of wikiData) {
            await client.query(`
        INSERT INTO wiki (title, slug, content, author_id) 
        VALUES ($1, $2, $3, $4)
      `, [item.title, item.slug, item.content, authorMap[item.author]]);
        }

        console.log('Banco de dados semeado com sucesso!');

    } catch (error) {
        console.error('Erro ao semear banco de dados:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
