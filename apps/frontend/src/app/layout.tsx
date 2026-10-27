import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "./ClientProviders";

export const metadata: Metadata = {
  title: "Gestión de proyectos",
  description: "Descubrimiento, gestión y ejecución del portafolio de proyectos, embebido en Monday.com",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icon.png" />
        <link rel="shortcut icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300..900;1,300..900&family=Figtree:ital,wght@0,300..900;1,300..900&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="m-0 h-full bg-bg-page p-0 font-sans text-text-main antialiased">
        <div id="app-root" className="flex min-h-screen flex-col">
          <ClientProviders>{children}</ClientProviders>
        </div>
      </body>
    </html>
  );
}
