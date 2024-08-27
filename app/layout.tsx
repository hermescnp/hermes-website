// app/layout.tsx
import App from './App'
import './globals.css'
import { ExperienceProvider } from '@/context/ExperienceContext'
import { ReactNode } from 'react'

// Define metadata using the metadata API in Next.js 13+
export const metadata = {
  title: "Hermes Science's Lab",
  description: 'UX/Technical Artist | Professional Musician Portfolio',
  openGraph: {
    title: "Hermes Science's Lab",
    description: 'UX/Technical Artist | Professional Musician Portfolio',
    url: "https://hermes.science",
    siteName: "Hermes Science's Lab",
    images: [
      {
        url: "/assets/CoverPhotographyWeb.jpeg",
        width: 1200,
        height: 630,
        alt: "Hermes Science's Lab Cover Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@YourTwitterHandle",
    creator: "@CreatorTwitterHandle",
    title: "Hermes Science's Lab",
    description: 'UX/Technical Artist | Professional Musician Portfolio',
    images: [
      {
        url: "/assets/CoverPhotographyWeb.jpeg",
        alt: "Hermes Science's Lab Cover Image",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/assets/favicon.ico" />
        <link rel="icon" href="/assets/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" href="/assets/favicon-16x16.png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
        <link rel="manifest" href="/assets/site.webmanifest" />
      </head>
      <body>
        <ExperienceProvider>
          <App>{children}</App>
        </ExperienceProvider>
      </body>
    </html>
  );
}
