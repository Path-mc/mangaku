import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE = "https://mangaku.citedd.my.id";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "MANGAKU — Baca Manga & Manhwa Bahasa Indonesia",
    template: "%s · MANGAKU",
  },
  description:
    "MANGAKU adalah platform baca manga dan manhwa berbahasa Indonesia. " +
    "Jelajahi katalog ribuan judul, ikuti chapter terbaru, dan simpan " +
    "riwayat bacaanmu. Dikembangkan oleh Citedd.",
  applicationName: "MANGAKU",
  keywords: [
    "manga", "manhwa", "baca manga", "komik online",
    "manga bahasa Indonesia", "manhwa Indonesia", "MANGAKU",
  ],
  authors: [{ name: "Citedd", url: SITE }],
  creator: "Citedd",
  publisher: "Citedd",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE,
    siteName: "MANGAKU",
    title: "MANGAKU — Baca Manga & Manhwa Bahasa Indonesia",
    description:
      "Platform baca manga dan manhwa berbahasa Indonesia dengan katalog " +
      "ribuan judul, chapter terbaru, dan riwayat bacaan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MANGAKU — Baca Manga & Manhwa Bahasa Indonesia",
    description:
      "Platform baca manga dan manhwa berbahasa Indonesia dengan katalog " +
      "ribuan judul, chapter terbaru, dan riwayat bacaan.",
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
