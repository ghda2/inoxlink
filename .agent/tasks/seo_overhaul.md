# Plano de Implementação: Suíte SEO (Estilo Yoast/RankMath)

Este documento rastreia a evolução da engenharia de SEO do projeto Inox Link, saindo de soluções ad-hoc (gambiarras) para uma arquitetura profissional e assistida no painel administrativo.

## 🟢 Fase 1: Fundação e Refatoração (Engenharia)
- [x] Criar utilitários centralizados em `src/utils/seo-helpers.ts`
    - [x] Função `stripHtml(html)`
    - [x] Função `truncate(text, length)`
    - [x] Função `calculateReadingTime(content)`
    - [x] Função `analyzeSEO(content, keywords, title, description)`
- [x] Limpar componentes frontend:
    - [x] Refatorar `src/components/SEO.astro` (usar `truncate`)
    - [x] Refatorar `src/pages/wiki/[slug].astro` (usar utilitários)
    - [x] Refatorar `src/pages/noticias/[slug].astro` (usar utilitários)
- [ ] Centralizar constantes de SEO em `src/config/seo.ts`


## 🟡 Fase 2: Painel Administrativo (Inteligência)
- [x] Localizar e mapear formulários de criação (Wiki/Notícias)
- [x] Adicionar campo "Palavra-chave Foco" ao banco de dados (Aproveitado campo `keywords`/`tags`)
- [x] Criar componente `SEOAnalyzer` (React)
    - [x] Análise em tempo real de contagem de palavras
    - [x] Verificação de densidade de palavras-chave
    - [x] Verificação de cabeçalhos (Simulado via comp. de análise)
    - [x] Pré-visualização do Google (Snippet Preview)
- [x] Interface de "Semáforo" (Vermelho, Amarelo, Verde) para o Score de SEO

## ⚪ Fase 3: SEO Avançado
- [x] Implementar análise de legibilidade (Flesch Score)
- [x] Sugestões de links internos baseados no conteúdo atual
- [x] Validador de Alt-Text em imagens enviadas


## 🔵 Fase 4: Inteligência Artificial Embarcada (O Diferencial)
- [x] Criar `src/services/ai.ts` (Interface para integração com modelos de LLM)
- [x] Implementar botões "Sugerir com IA" no Painel Admin:
    - [x] Gerador automático de Meta Title e Meta Description
    - [x] Sugestão de Palavras-Chave foco baseadas no texto
- [ ] Implementar "Analisador de Tom de Voz" (Industrial/Técnico vs Comercial)
- [ ] Assistente de Reescrita: Sugestões para melhorar o Flesch Score (Legibilidade)


---
*Ultima atualização: 25/01/2026*
