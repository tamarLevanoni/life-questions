import type { Metadata } from "next";
import { Geist, Geist_Mono, Heebo } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Footer } from "@/components/layout/footer";
import { StoreHydrator } from "@/components/common/store-hydrator";
import { getReference } from "@/lib/server/reference";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const heebo = Heebo({
  variable: "--font-hebrew",
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "שאלות מהחיים | Life Questions",
  description: "אפליקציה לתוכן תורני עם סיפורים, שאלות ותשובות מעמיקות. לומדים מהחיים, מבינים את התורה.",
  keywords: ["שאלות מהחיים", "תורה", "יהדות", "סיפורים", "שאלות ותשובות", "לימוד תורה"],
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.svg",
  },
  openGraph: {
    title: "שאלות מהחיים | Life Questions",
    description: "אפליקציה לתוכן תורני עם סיפורים, שאלות ותשובות מעמיקות.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "שאלות מהחיים | Life Questions",
    description: "אפליקציה לתוכן תורני עם סיפורים, שאלות ותשובות מעמיקות.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const reference = await getReference();
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${heebo.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <StoreHydrator reference={reference}>
          <Providers>{children}</Providers>
          <Footer />
        </StoreHydrator>
      </body>
    </html>
  );
}