import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "./ClientProviders";

export const metadata: Metadata = {
  title: "DevCycle — Portafolio de Proyectos",
  description: "Descubrimiento, gestión y ejecución del portafolio de proyectos, embebido en Monday.com",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div id="app-root">
          <ClientProviders>{children}</ClientProviders>
        </div>
      </body>
    </html>
  );
}
