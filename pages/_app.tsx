import 'styles/global.css'

import { AppProps } from 'next/app'
import { Raleway } from 'next/font/google'
import Head from 'next/head';

const raleway = Raleway({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="stylesheet" href="//cdn-images.mailchimp.com/embedcode/classic-061523.css" type="text/css" />
        <meta name="color-scheme" content="light only" />
      </Head>
      <main className={raleway.className} style={{ backgroundColor: "white" }}>
        <Component {...pageProps} />
      </main>
    </>

  )
}
