import type { Metadata, Viewport } from "next";
import { Newsreader, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.scss";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ClementBanner from "@/components/ClementBanner";
import Terminal from "@/components/Terminal";
import ScrollTop from "@/components/ScrollTop";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0F0F12",
}

const BASE = 'https://clementbacle.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Clément Bacle — Software Engineer & AI Builder",
    template: "%s — Clément Bacle",
  },
  description:
    "Senior fullstack engineer and ex-founder writing about software, AI workflows, and entrepreneurship. Based in Lille, France.",
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE,
    siteName: 'Clément Bacle',
    title: "Clément Bacle — Software Engineer & AI Builder",
    description:
      "Senior fullstack engineer and ex-founder writing about software, AI workflows, and entrepreneurship.",
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@clementbacle',
    title: "Clément Bacle — Software Engineer & AI Builder",
    description:
      "Senior fullstack engineer and ex-founder writing about software, AI workflows, and entrepreneurship.",
    images: ['/opengraph-image'],
  },
  alternates: { canonical: BASE },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-theme="dark"
      className={`${newsreader.variable} ${jetbrainsMono.variable} ${geist.variable}`}
    >
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <Terminal />
        <ScrollTop />
        <ClementBanner />
      </body>
    </html>
  );
}
