import Head from 'next/head';
import './globals.css'
import { ExperienceProvider } from '@/context/ExperienceContext';
import App from './App';

export const metadata = {
  title: "Hermes Science's Lab",
  description: 'UX/Technical Artist | Professional Musician Portfolio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ExperienceProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="shortcut icon" href="/assets/favicon.png" />
      </Head>
      <App>{children}</App>
    </ExperienceProvider>
  );
}
