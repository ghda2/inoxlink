import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta"
});

export const metadata: Metadata = {
  title: "Inox Link | Seu Portal Completo de Aço Inoxidável",
  description: "Notícias, tendências, enciclopédia wiki e tudo o que você precisa saber sobre o mundo do aço inox.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable}`}>
      <body suppressHydrationWarning className="bg-white selection:bg-indigo-100 selection:text-indigo-900 scroll-smooth">
        {children}
      </body>
    </html>
  );
}