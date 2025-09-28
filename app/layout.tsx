import type { Metadata } from 'next'
import Script from 'next/script'
import { Geist, Geist_Mono, Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { InteractiveBg } from './components/interactive-bg'
import { AuthProvider } from '@/lib/auth-context'
import ConditionalNavbar from './components/conditional-navbar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap'
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap'
})

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com').replace(/\/$/, '')
const ogImageUrl = `${siteUrl}/assets/og-image.png`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MD. Mobin — Mobile & Web Developer',
    template: '%s | MD. Mobin'
  },
  description:
    'Portfolio of MD. Mobin — building performant mobile and web apps with Flutter, Swift, React Native and React.',
  keywords: [
    'MD. Mobin',
    'Software Engineer',
    'Flutter',
    'React',
    'Next.js',
    'React Native',
    'Mobile apps',
    'Web development',
    'Portfolio'
  ],
  authors: [{ name: 'MD. Mobin' }],
  creator: 'MD. Mobin',
  publisher: 'MD. Mobin',
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/assets/app_icon.svg', sizes: '512x512', type: 'image/svg+xml' },
      { url: '/assets/app_icon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ],
    apple: [{ url: '/assets/app_icon.svg', sizes: '180x180', type: 'image/svg+xml' }],
    shortcut: '/favicon.ico'
  }
}

function getMetaTitle(title: Metadata['title']) {
  if (typeof title === 'string') return title
  if (title && typeof title === 'object' && 'default' in title) return title.default
  return ''
}

function getMetaDescription(description: Metadata['description']) {
  if (typeof description === 'string') return description
  if (description === null || description === undefined) return ''
  return String(description)
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const metaTitle = getMetaTitle(metadata.title)
  const metaDescription = getMetaDescription(metadata.description)

  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
        <link rel='icon' href='/favicon.ico' type='image/x-icon' />
        <link rel='apple-touch-icon' href='/assets/app_icon.svg' />

        {/* Preconnect for performance */}
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link rel='preconnect' href='https://img.buymeacoffee.com' crossOrigin='anonymous' />

        {/* Open Graph for Facebook, LinkedIn, Discord */}
        <meta property='og:title' content={metaTitle} />
        <meta property='og:description' content={metaDescription} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={siteUrl} />
        <meta property='og:site_name' content='MD. Mobin' />
        <meta property='og:locale' content='en_US' />
        <meta property='og:image' content={ogImageUrl} />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:image:alt' content='MD. Mobin Portfolio' />
        <meta property='og:image:type' content='image/png' />

        {/* Twitter Card */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={metaTitle} />
        <meta name='twitter:description' content={metaDescription} />
        <meta name='twitter:image' content={ogImageUrl} />
        <meta name='twitter:site' content='@YourTwitterHandle' />
        <meta name='twitter:creator' content='@YourTwitterHandle' />

        {/* Optional rich meta for platforms */}
        <meta property='article:author' content='MD. Mobin' />
        <meta property='article:publisher' content='MD. Mobin' />
        <meta property='og:updated_time' content={new Date().toISOString()} />

        {/* Fallback for LinkedIn */}
        <meta name='linkedin:card' content='summary_large_image' />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfair.variable} antialiased`}>
        <AuthProvider>
          <Providers>
            <InteractiveBg />
            <ConditionalNavbar />

            {/* JSON-LD Structured Data */}
            <Script id='ld-json' type='application/ld+json' strategy='afterInteractive'>
              {JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Person',
                name: 'MD. Mobin',
                url: siteUrl,
                jobTitle: 'Software Engineer',
                sameAs: []
              })}
            </Script>

            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}
