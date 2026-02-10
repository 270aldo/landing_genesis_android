import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NGX GENESIS — Performance & Longevity",
  description:
    "El músculo es el órgano de la longevidad. GENESIS es el sistema que activa tu rendimiento y longevidad con IA + coaching humano.",
  openGraph: {
    title: "NGX GENESIS — Performance & Longevity",
    description: "El músculo es el órgano de la longevidad.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                history.scrollRestoration = "manual";
                window.scrollTo(0, 0);
                window.addEventListener("beforeunload", function () {
                  window.scrollTo(0, 0);
                });
              } catch (e) {}
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
