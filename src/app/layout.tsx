import type { Metadata } from "next";
import "./globals.css";
import "nprogress/nprogress.css";
import AuthProvider from "@/components/AuthProvider";
import AOSProvider from "@/components/AOSProvider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { ScreenLoader } from "@/components/ScreenLoader";
import { RouteLoader } from "@/components/RouteLoader";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "SurtiBolivia · Tu Supermercado en Línea",
  description: "El supermercado de la familia boliviana. Abarrotes, frutas, lácteos, carnes, bebidas y ropa artesanal inspirada en los 9 departamentos. Envío a todo Bolivia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
        <AOSProvider>
        <Toaster richColors position="top-right" closeButton />
        <ScreenLoader />
        <Suspense><RouteLoader /></Suspense>
        <StoreHeader />
        <main className="flex-1">{children}</main>
        <StoreFooter />

        </AOSProvider>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
