import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "GuitarPorn — Guitar community",
    template: "%s · GuitarPorn",
  },
  description:
    "A premium dark-space for guitarists: gear gallery, curated videos, and shop links.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
    >
      <body className="flex min-h-full flex-col bg-zinc-950 font-sans text-zinc-100 antialiased">
        <SiteNavbar />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
