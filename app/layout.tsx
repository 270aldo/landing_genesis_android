import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

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
      </head>
      <body className={`${inter.variable} ${jetBrainsMono.variable}`}>{children}</body>
    </html>
  );
}
