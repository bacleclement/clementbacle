import type { Metadata } from "next";
import { Newsreader, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.scss";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

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

export const metadata: Metadata = {
  title: "Clément Bacle — Programmer's Press",
  description:
    "Personal site of Clément Bacle. Building AI agents, writing about what works.",
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
        <div className="shell">
          <Nav />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
