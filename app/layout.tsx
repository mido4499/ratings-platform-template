import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { SessionProvider } from "next-auth/react";


const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: 'Sisyphus Apply - Job Applications Reviews',
  description: `Applying for jobs today feels like Sisyphus pushing the rock up the mountain.
  Stop wasting time applying for fake job postings and find the perfect company to apply for. 
  Check ratings for different companies based on their application process.`,
  openGraph: {
    title: 'Sisyphus Apply',
    description: `Applying for jobs today feels like Sisyphus pushing the rock up the mountain.
    Stop wasting time applying for fake job postings and find the perfect company to apply for. 
    Check ratings for different companies based on their application process.`,
    url: 'https://sisyphusapply.com',
    images: [
      {
        url: 'https://sisyphusapply.com/og-image.png',
        width: 1200,
        height: 630,
      }
    ]
  }
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
        lang="en"
        className={`${lato.variable} h-full antialiased`}
      >
        <body className="min-h-full bg-(--stone) flex flex-col font-(--font-lato) text-(--rock)" suppressHydrationWarning>
          <SessionProvider>
            <div className="z-1 relative">
              <Navbar />
            </div>
            {children}
          </SessionProvider>
          
        </body>
      </html>
  );
}
