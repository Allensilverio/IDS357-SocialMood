import type { Metadata } from "next";
import { Ubuntu, Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Head from 'next/head';
import MobileMessage from "@/components/ui/mobile";
import I18nProvider from "../i18n/i18n-client";


const rubik = Ubuntu({
  style: "normal",
  weight: ["400", "500", "700"],
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SocialMood App",
  description: "",
  icons: {
    icon: '/icon.ico',
  },
};

export const fetchCache = 'force-no-store';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={rubik.className}>
      <Head>
        <link rel="icon" href="/icon.ico" />
      </Head>
      <body>
        <MobileMessage>
          <main className="antialiased min-h-screen flex items-center justify-center overflow-auto">
          <I18nProvider>{children}</I18nProvider>
          </main>
          <Toaster />
        </MobileMessage>
      </body>
    </html>
  );
}
