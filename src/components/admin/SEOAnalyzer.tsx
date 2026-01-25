import React from 'react';
import { analyzeSEO } from '../../utils/seo-helpers';
import { CheckCircle2, AlertCircle, XCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface SEOAnalyzerProps {
    content: string;
    title: string;
    description: string;
    focusKeyword: string;
    onKeywordChange: (keyword: string) => void;
}

export default function SEOAnalyzer({
    content,
    title,
    description,
    focusKeyword,
    onKeywordChange
}: SEOAnalyzerProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const result = analyzeSEO(content, title, description, focusKeyword);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'text-emerald-500';
            case 'warning': return 'text-amber-500';
            case 'error': return 'text-rose-500';
            default: return 'text-zinc-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success': return <CheckCircle2 size={14} />;
            case 'warning': return <AlertCircle size={14} />;
            case 'error': return <XCircle size={14} />;
            default: return <Info size={14} />;
        }
    };

    const scoreColor = result.score >= 75 ? 'bg-emerald-500' : result.score >= 50 ? 'bg-amber-500' : 'bg-rose-500';

    return (
        <section className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 bg-zinc-50 border-b border-zinc-100"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${scoreColor} flex items-center justify-center text-white text-[10px] font-black`}>
                        {result.score}
                    </div>
                    <h4 className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider">Análise de SEO</h4>
                </div>
                {isExpanded ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
            </button>

            {isExpanded && (
                <div className="p-4 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Palavra-chave Foco</label>
                        <input
                            type="text"
                            value={focusKeyword}
                            onChange={(e) => onKeywordChange(e.target.value)}
                            placeholder="Ex: aço inox 304"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs font-bold text-zinc-900 outline-none focus:ring-1 focus:ring-black transition-all"
                        />
                    </div>

                    <div className="space-y-3 pt-2">
                        {result.checks.map((check, idx) => (
                            <div key={idx} className="flex items-start gap-2.5">
                                <div className={`mt-0.5 ${getStatusColor(check.status)}`}>
                                    {getStatusIcon(check.status)}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-bold text-zinc-900 leading-none">{check.label}</p>
                                    <p className="text-[10px] text-zinc-500 leading-tight">{check.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-zinc-50">
                        <div className="bg-zinc-50 rounded-lg p-3 space-y-2">
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Google Preview</p>
                            <div className="space-y-1">
                                <p className="text-[#1a0dab] text-sm hover:underline cursor-pointer truncate">
                                    {title || 'Título da Página...'} | Inox Link
                                </p>
                                <p className="text-[#006621] text-[11px] truncate">
                                    inoxlink.com.br › noticias › ...
                                </p>
                                <p className="text-[#4d5156] text-[11px] line-clamp-2">
                                    {description || 'Adicione uma meta descrição para ver como seu post aparecerá nos resultados do Google.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
