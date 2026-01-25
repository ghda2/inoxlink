/**
 * SEO Helpers & Text Utilities
 * Centraliza a lógica de processamento de texto e análise de SEO do projeto.
 */

/**
 * Remove tags HTML de uma string de forma segura.
 */
export function stripHtml(html: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Trunca um texto em um limite de caracteres, garantindo que não quebre palavras
 * e adicionando reticências se necessário.
 */
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
    if (!text || text.length <= maxLength) return text || '';

    // Corta no limite e volta até o último espaço para não quebrar palavra
    let truncated = text.substring(0, maxLength - suffix.length);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0) {
        truncated = truncated.substring(0, lastSpace);
    }

    return truncated + suffix;
}

/**
 * Calcula o tempo estimado de leitura baseado em 200 palavras por minuto.
 */
export function calculateReadingTime(content: string): number {
    const words = stripHtml(content).split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes > 0 ? minutes : 1;
}

/**
 * Conta as sílabas de uma palavra em português (Heurística baseada em vogais).
 */
function countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const syllables = word.match(/[aeiouyàáâãèéêìíîòóôõùúûý]{1,2}/g);
    return syllables ? syllables.length : 1;
}

/**
 * Calcula o índice de facilidade de leitura de Flesch adaptado para Português.
 * Fórmula: 248.835 - (1.015 * palavras/frases) - (84.6 * silabas/palavras)
 */
export function calculateFleschScore(content: string): number {
    const text = stripHtml(content);
    if (!text || text.length < 50) return 100;

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
    const wordsList = text.split(/\s+/).filter(w => w.trim().length > 0);
    const words = wordsList.length || 1;

    let totalSyllables = 0;
    wordsList.forEach(w => {
        totalSyllables += countSyllables(w);
    });

    const score = 248.835 - (1.015 * (words / sentences)) - (84.6 * (totalSyllables / words));
    return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Interface para o resultado da análise de SEO
 */
export interface SEOResult {
    score: number; // 0 a 100
    checks: {
        label: string;
        status: 'success' | 'warning' | 'error';
        message: string;
    }[];
}

/**
 * Analisa o conteúdo e retorna um score e dicas de melhoria.
 */
export function analyzeSEO(
    content: string,
    title: string,
    description: string,
    focusKeyword?: string
): SEOResult {
    const checks: SEOResult['checks'] = [];
    const cleanContent = stripHtml(content).toLowerCase();
    const cleanTitle = title.toLowerCase();
    const cleanDesc = description.toLowerCase();
    let score = 0;

    // 1. Verificação de Comprimento do Texto
    const wordCount = cleanContent.split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 300) {
        checks.push({ label: 'Tamanho do texto', status: 'warning', message: 'O texto é curto demais (menos de 300 palavras).' });
    } else {
        score += 20;
        checks.push({ label: 'Tamanho do texto', status: 'success', message: `Bom trabalho! (${wordCount} palavras)` });
    }

    // 2. Verificação do Título
    if (title.length < 30) {
        checks.push({ label: 'Título SEO', status: 'warning', message: 'O título é muito curto.' });
    } else if (title.length > 60) {
        checks.push({ label: 'Título SEO', status: 'error', message: 'O título será cortado pelo Google.' });
    } else {
        score += 20;
        checks.push({ label: 'Título SEO', status: 'success', message: 'O comprimento do título está ideal.' });
    }

    // 3. Verificação da Meta Description
    if (!description || description.length < 120) {
        checks.push({ label: 'Meta descrição', status: 'warning', message: 'A meta descrição está curta ou ausente.' });
    } else if (description.length > 160) {
        checks.push({ label: 'Meta descrição', status: 'warning', message: 'A descrição é longa e será truncada.' });
    } else {
        score += 20;
        checks.push({ label: 'Meta descrição', status: 'success', message: 'A meta descrição tem um bom tamanho.' });
    }

    // 4. Verificação de Legibilidade (Flesch)
    const flesch = calculateFleschScore(content);
    if (flesch < 40) {
        checks.push({ label: 'Legibilidade', status: 'error', message: `Leitura difícil (${flesch}). Use frases mais curtas.` });
    } else if (flesch < 65) {
        score += 10;
        checks.push({ label: 'Legibilidade', status: 'warning', message: `Leitura média (${flesch}). Considere simplificar.` });
    } else {
        score += 20;
        checks.push({ label: 'Legibilidade', status: 'success', message: `Excelente legibilidade (${flesch})!` });
    }

    // 5. Verificação de Palavra-Chave (se fornecida)
    if (focusKeyword && focusKeyword.trim() !== '') {
        const kw = focusKeyword.toLowerCase();
        const kwInTitle = cleanTitle.includes(kw);
        const kwInContent = cleanContent.includes(kw);

        if (kwInTitle && kwInContent) {
            score += 20;
            checks.push({ label: 'Palavra-Chave foco', status: 'success', message: 'Palavra-chave presente no título e conteúdo!' });
        } else {
            if (!kwInTitle) checks.push({ label: 'Palavra-Chave no título', status: 'error', message: 'A palavra-chave não aparece no título.' });
            if (!kwInContent) checks.push({ label: 'Palavra-Chave no conteúdo', status: 'error', message: 'A palavra-chave não aparece no texto.' });
        }
    } else {
        checks.push({ label: 'Palavra-Chave foco', status: 'warning', message: 'Defina uma palavra-chave para análise profunda.' });
    }

    // 6. Verificação de Links Internos (Simulada)
    const internalLinks = (content.match(/href=["']\//g) || []).length;
    if (internalLinks === 0) {
        checks.push({ label: 'Links Internos', status: 'warning', message: 'Nenhum link interno encontrado. Adicione links para outras páginas do Inox Link.' });
    } else {
        checks.push({ label: 'Links Internos', status: 'success', message: `Você tem ${internalLinks} link(s) interno(s).` });
    }

    // 7. Verificação de Imagens e Alt-Text (Simulada via conteúdo)
    const images = (content.match(/<img/g) || []).length;
    const alts = (content.match(/alt=["'][^"']+["']/g) || []).length;
    if (images > 0 && alts < images) {
        checks.push({ label: 'Atributo ALT', status: 'error', message: 'Algumas imagens no conteúdo estão sem descrição (Alt Text).' });
    } else if (images > 0) {
        checks.push({ label: 'Atributo ALT', status: 'success', message: 'Todas as imagens do conteúdo possuem Alt Text.' });
    }

    return { score, checks };
}
