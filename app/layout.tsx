import Head from 'next/head';
import './globals.css';
import { ExperienceProvider } from '@/context/ExperienceContext';
import App from './App';

export const metadata = {
  title: "Hermes Science's Lab",
  description: 'UX/Technical Artist | Professional Musician Portfolio',
  url: "https://hermes.science",
  image: "https://opengraph.b-cdn.net/production/images/b945ebb7-ea26-479f-bd20-b9281729e045.jpg?token=YfaCPT4PbT2gYsS8OiotQiqRFgtfPxHaY6HTbaJ7LaM&height=530&width=800&expires=33260266770",
  twitterDomain: "hermes.science",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ExperienceProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="shortcut icon" href="/assets/favicon.ico" />

        {/* Open Graph / Facebook Meta Tags */}
        <meta property="og:url" content={metadata.url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.image} />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content={metadata.twitterDomain} />
        <meta property="twitter:url" content={metadata.url} />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.image} />
      </Head>
      <App>{children}</App>
    </ExperienceProvider>
  );
}
