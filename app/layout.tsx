// app/layout.tsx (or app/page.tsx depending on your project structure)
import Head from 'next/head';
import './globals.css';
import { ExperienceProvider } from '@/context/ExperienceContext';
import App from './App';

// Define metadata using the metadata API
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
        url: "/assets/CoverPhotographyWeb.jpeg", // Ensure the path is correct and accessible
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
        url: "/assets/CoverPhotographyWeb.jpeg", // Ensure the path is correct and accessible
        alt: "Hermes Science's Lab Cover Image",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ExperienceProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/assets/favicon.ico" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <App>{children}</App>
    </ExperienceProvider>
  );
}
