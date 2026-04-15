import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";

export const metadata: Metadata = {
  title: "NovaTech · Marketplace Tecnológico",
  description: "Marketplace multi-vendor de tecnología y accesorios en Bolivia. Múltiples vendedores verificados, ofertas flash, programa de lealtad y envío a todo el país.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
        <Toaster richColors position="top-right" closeButton />

        <StoreHeader />
        <main className="flex-1">{children}</main>
        <StoreFooter />

        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
