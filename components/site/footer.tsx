import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-300">
            <div className="container mx-auto px-4 md:px-6 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-950 font-bold text-lg group-hover:bg-white transition-colors">
                                IL
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Inox<span className="text-slate-500">Link</span>
                            </span>
                        </Link>
                        <p className="text-slate-500 leading-relaxed font-medium">
                            O Inox Link é o seu portal definitivo para notícias, tecnologia e inovação no mundo do aço inoxidável.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-xl border border-slate-800 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="w-10 h-10 rounded-xl border border-slate-800 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="w-10 h-10 rounded-xl border border-slate-800 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="w-10 h-10 rounded-xl border border-slate-800 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Linkedin className="h-5 w-5" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em]">Navegação</h4>
                        <ul className="space-y-3 font-medium text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">Início</Link></li>
                            <li><Link href="/wiki" className="hover:text-white transition-colors">Enciclopédia Wiki</Link></li>
                            <li><Link href="/sobre" className="hover:text-white transition-colors">Nossa História</Link></li>
                            <li><Link href="/contato" className="hover:text-white transition-colors">Entre em contato</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="md:col-span-2 lg:col-span-2 space-y-6">
                        <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em]">Newsletter Semanal</h4>
                        <p className="text-slate-500 text-sm font-medium">
                            Assine para receber resumos técnicos e atualizações de mercado por especialistas.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Input
                                placeholder="Seu melhor e-mail"
                                className="bg-slate-900 border-slate-800 text-white focus:ring-slate-500 focus:border-slate-500 h-12 rounded-xl"
                            />
                            <Button className="bg-white text-black hover:bg-slate-200 h-12 px-8 rounded-xl font-bold">
                                Assinar agora
                            </Button>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                            <Mail className="h-4 w-4" /> sem spam, cancele quando quiser.
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} Inox Link. Todos os direitos reservados.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                        <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
