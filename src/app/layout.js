import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
 title: "TinyLink – Shorten, Share, Track",
  description: "A beautiful, fast, and private URL shortener with analytics.",
  keywords: "url shortener, link shortener, tinyurl, analytics, tracking",
  authors: [{ name: "Amit kumar" }],
  creator: "Amit kumar",
  openGraph: {
    title: "TinyLink – Your Smart URL Shortener",
    description: "Shorten links, track clicks, and own your data.",
    url: "https://tinylink-taupe.vercel.app/",
    siteName: "TinyLink",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TinyLink",
    description: "Shorten, share, and track your links with style.",
  },
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/apple-touch-icon.png"],
    shortcut: ["/favicon-32x32.png"],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicons & Manifest */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >

        {children}
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 2000,
            style: {
              background: '#1f2937',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '12px',
              padding: '12px 20px',
            },
            success: {
              icon: 'Copied!',
              style: {
                background: '#10b981',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
