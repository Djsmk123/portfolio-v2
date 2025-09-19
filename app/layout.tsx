import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { InteractiveBg } from "./components/interactive-bg";
import { AuthProvider } from "@/lib/auth-context";
import ConditionalNavbar from "./components/conditional-navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "")

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MD. Mobin — Mobile & Web Developer",
    template: "%s | MD. Mobin",
  },
  description:
    "Portfolio of MD. Mobin — building performant mobile and web apps with Flutter, Swift, React Native and React.",
  keywords: [
    "MD. Mobin",
    "Software Engineer",
    "Flutter",
    "React",
    "Next.js",
    "React Native",
    "Mobile apps",
    "Web development",
    "Portfolio",
  ],
  authors: [{ name: "MD. Mobin" }],
  creator: "MD. Mobin",
  publisher: "MD. Mobin",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "MD. Mobin — Mobile & Web Developer",
    description:
      "Portfolio of MD. Mobin — building performant mobile and web apps with Flutter, Swift, React Native and React.",
    siteName: "MD. Mobin",
    images: [
      {
        url: "/assets/globe.svg",
        width: 1200,
        height: 630,
        alt: "MD. Mobin Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MD. Mobin — Mobile & Web Developer",
    description:
      "Portfolio of MD. Mobin — building performant mobile and web apps with Flutter, Swift, React Native and React.",
    images: ["/assets/globe.svg"],
  },
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfair.variable} antialiased`}>
        <AuthProvider>
          <Providers>
            <InteractiveBg />
            <ConditionalNavbar />
            {/* JSON-LD Structured Data */}
            <Script id="ld-json" type="application/ld+json" strategy="afterInteractive">
              {JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Person',
                name: 'MD. Mobin',
                url: siteUrl,
                jobTitle: 'Software Engineer',
                sameAs: [],
              })}
            </Script>
            {/* Preconnect for performance */}
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://img.buymeacoffee.com" crossOrigin="anonymous" />
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
