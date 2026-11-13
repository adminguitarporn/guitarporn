import { Geist, Geist_Mono } from "next/font/google";
import { ClubAnalytics } from "@/components/analytics/club-analytics";
import { Atmosphere } from "@/components/fx/atmosphere";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = rootMetadata;

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
        <Atmosphere />
        <SiteNavbar />
        <div className="relative z-10 flex-1">{children}</div>
        <SiteFooter />
        {process.env.VERCEL === "1" ? <ClubAnalytics /> : null}
      </body>
    </html>
  );
}
