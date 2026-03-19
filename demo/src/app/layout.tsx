import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Insurance Agent OS",
  description: "Sistema operativo para agentes de seguros — Demo de inversión",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IAOS",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7941D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body className="min-h-full font-[Questrial] bg-[#EFF2F9] text-[#1A1F2B] antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
