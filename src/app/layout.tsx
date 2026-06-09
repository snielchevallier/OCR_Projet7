import type { Metadata } from "next";
import { Manrope, Inter} from "next/font/google";
import "./globals.css";
import { LoadingProvider } from '@/context/LoadingContext'

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Abricot.co",
  description: "SaaS de gestion de tâches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col items-center font-inter">
        <LoadingProvider>{children}</LoadingProvider>
      </body>
    </html>
  );
}
