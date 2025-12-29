"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
    categories: any[];
}

export function Navbar({ categories }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Pages that start with a dark hero section
    const isDarkHero = pathname === "/" || pathname === "/wiki";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Navbar style based on state
    // Default (Dark Hero): Transparent BG, White Text
    // Scrolled OR Light Page: White BG, Dark Text
    const isLightMode = isScrolled || !isDarkHero;

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                isLightMode
                    ? "bg-white/90 backdrop-blur-md border-slate-200 py-3 shadow-sm"
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl transition-colors border",
                            isLightMode
                                ? "bg-slate-900 text-white border-slate-800 group-hover:bg-black"
                                : "bg-white text-slate-950 border-white group-hover:bg-slate-200"
                        )}>
                            IL
                        </div>
                        <span className={cn(
                            "text-2xl font-bold tracking-tight transition-colors",
                            isLightMode ? "text-slate-900" : "text-white"
                        )}>
                            Inox<span className={cn(isLightMode ? "text-slate-500" : "text-slate-400")}>Link</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {categories.slice(0, 5).map((category) => (
                            <Link
                                key={category.id}
                                href={`/category/${category.slug}`}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-slate-900",
                                    isLightMode ? "text-slate-600" : "text-white/90 hover:text-white"
                                )}
                            >
                                {category.name}
                            </Link>
                        ))}
                        <Link
                            href="/wiki"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-slate-900",
                                isLightMode ? "text-slate-600" : "text-white/90 hover:text-white"
                            )}
                        >
                            Wiki
                        </Link>
                    </div>

                    {/* Search & Actions */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className={cn(
                            "rounded-full transition-colors",
                            isLightMode ? "text-slate-600 hover:bg-slate-100" : "text-white hover:bg-white/10"
                        )}>
                            <Search className="h-5 w-5" />
                        </Button>

                        <Link href="/admin">
                            <Button variant={isLightMode ? "default" : "secondary"} className={cn(
                                "hidden md:flex px-6 rounded-xl",
                                isLightMode ? "bg-slate-900 hover:bg-black text-white" : "bg-white text-slate-900 hover:bg-slate-200"
                            )}>
                                Painel
                            </Button>
                        </Link>

                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "lg:hidden h-10 w-10",
                                isLightMode ? "text-slate-900" : "text-white hover:bg-white/10"
                            )}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={cn(
                "lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 transition-all duration-300 overflow-hidden shadow-2xl",
                isMobileMenuOpen ? "max-h-screen opacity-100 py-6" : "max-h-0 opacity-0"
            )}>
                <div className="container mx-auto px-4 flex flex-col gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="text-lg font-bold text-slate-700 hover:text-black py-3 border-b border-slate-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {category.name}
                        </Link>
                    ))}
                    <Link
                        href="/wiki"
                        className="text-lg font-bold text-slate-700 hover:text-black py-3 border-b border-slate-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Wiki
                    </Link>
                    <Link href="/admin">
                        <Button className="w-full mt-4 bg-slate-900 text-white rounded-xl py-6 text-lg font-bold">Acessar Painel</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
