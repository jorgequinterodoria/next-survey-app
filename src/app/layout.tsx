import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Batería de Riesgo Psicosocial - Evaluación de Factores de Riesgo",
  description: "Plataforma de evaluación de factores de riesgo psicosocial en el trabajo. Cumple con la normativa colombiana para la evaluación de riesgos laborales.",
  keywords: ["riesgo psicosocial", "evaluación laboral", "salud ocupacional", "batería de riesgo", "estrés laboral"],
  authors: [{ name: "Evaluación Psicosocial" }],
  openGraph: {
    title: "Batería de Riesgo Psicosocial",
    description: "Evaluación de factores de riesgo psicosocial en el trabajo",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
