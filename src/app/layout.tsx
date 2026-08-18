import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shoot With Purpose — Photography Intensive Masterclass",
  description:
    "A 3-day transformational photography intensive in Accra. Learn to shoot with intent, composition, light, and purpose. Limited spots available.",
  keywords: ["photography", "masterclass", "Accra", "Ghana", "photography class"],
  openGraph: {
    title: "Shoot With Purpose — Photography Intensive Masterclass",
    description: "A 3-day transformational photography intensive in Accra. Limited spots.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for faster font loading */}
        <link rel="preconnect" href="https://api.fontshare.com" />

        {/* Satoshi — body & UI text */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
        />
        {/* Clash Display — all headings */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
        />
      </head>
      <body style={{ fontFamily: "'Satoshi', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
