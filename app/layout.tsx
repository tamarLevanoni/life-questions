import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Heebo, Secular_One } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Footer } from "@/components/layout/footer";
import { AppDataLoader } from "@/components/layout/app-data-loader";
import { AuthAlert } from "@/components/layout/auth-alert";

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

const secularOne = Secular_One({
  variable: "--font-noa-shalev-face",
  subsets: ["latin", "hebrew"],
  weight: "400",
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
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${heebo.variable} ${secularOne.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <Suspense>
          <AppDataLoader />
        </Suspense>
        <Providers>
          {children}
          <Footer />
          <Suspense>
            <AuthAlert />
          </Suspense>
        </Providers>
        <script src="https://widget.tabnav.com/limited-widget.min.js.gz?req=vTucdlJzvjjDDXndRF6yoBvFWFfw0wEj" tnv-data-config='{"language":"he","color":"#405ec3","buttonColor":"#405ec3","buttonSize":"small","widgetSize":"small","widgetLocation":"right","buttonLocation":"bottom"}' defer></script>
<noscript> פתרונות נגישות לאתרי אינטרנט לפי התקן הישראלי 5568<a href="https://tabnav.com/he">הנגשת אתרים</a> </noscript>
      </body>
    </html>
  );
}