/**
 * AI Service - Inox Link
 * Interface para integração com modelos de linguagem (LLMs).
 */

export interface AISuggestion {
    title: string;
    description: string;
    keywords: string;
}

export const aiService = {
    /**
     * Gera sugestões de metadados SEO baseados no conteúdo.
     */
    async suggestMetadata(content: string, originalTitle: string): Promise<AISuggestion> {
        // Verificamos se há uma chave de API (Ex: GEMINI_API_KEY)
        // Se não houver, retornamos um comportamento "Smart Heuristic" ou um erro informativo.

        // Para efeito de demonstração e desenvolvimento da UI, vamos simular o processamento.
        // Em produção, isso faria um fetch para a API da Google Gemini ou similar.

        console.log('IA analisando conteúdo para:', originalTitle);

        // Simulação de delay de rede da IA
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Lógica Heurística (Enquanto não conectamos uma chave real)
        const words = content.replace(/<[^>]*>?/gm, ' ').split(/\s+/);
        const topKeywords = words
            .filter(w => w.length > 5)
            .slice(0, 3)
            .join(', ');

        return {
            title: `${originalTitle} | Inox Link Especialista`,
            description: `Saiba tudo sobre ${originalTitle}. Artigo técnico especializado sobre o mercado de aço inoxidável e soluções industriais.`,
            keywords: topKeywords.toLowerCase()
        };
    }
};
