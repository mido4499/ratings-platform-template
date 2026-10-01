import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { SessionProvider } from "next-auth/react";
import { siteConfig } from "@/src/config/site";


const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  // Relative URLs in metadata (like the image below) are resolved against this.
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    // Pages only set their own title, e.g. 'Sign in' -> 'Sign in - Sisyphus Apply'
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: '/',
    images: [
      {
        url: siteConfig.images.ogImage,
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