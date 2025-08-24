import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const dynamic = "force-static";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://griffindow.com"),
  title: "Griffin Dow",
  description:
    "Relentlessly shaped by vision, I build toward what does not yet exist — beginning with myself.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Griffin Dow",
    description:
      "Relentlessly shaped by vision, I build toward what does not yet exist — beginning with myself.",
    url: "https://griffindow.com",
    siteName: "Griffin Dow",
    images: [
      { url: "/apple-touch-icon.png", width: 180, height: 180, alt: "Griffin Dow" },
    ],
  },
  twitter: {
    card: "summary",
    site: "@griffinodow",
    creator: "@griffinodow",
  },
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <a href="#learn" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-foreground focus:text-background focus:px-3 focus:py-1.5 focus:rounded">
          Skip to links
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Griffin Dow",
              url: "https://griffindow.com",
              sameAs: [
                "https://github.com/griffindow",
                "https://x.com/griffinodow",
                "https://instagram.com/griffinodow",
                "https://www.linkedin.com/in/griffinodow/",
              ],
              jobTitle: "Product Engineer",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
