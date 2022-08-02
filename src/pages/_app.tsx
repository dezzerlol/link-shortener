import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { MantineProvider } from '@mantine/core'
import Head from 'next/head'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <link rel='icon' type='image/png' href='/icon.png' sizes='32x32' />
        <title>Shorten your link</title>
      </Head>
      <SessionProvider session={session}>
        <MantineProvider>
          <Component {...pageProps} />
        </MantineProvider>
      </SessionProvider>
    </>
  )
}

export default MyApp

//BUG:
// nextjs 12.2 styles from mantine flickering
// downgrade to 12.1.6 => diff middleware should be used
// TODO:
// add custom slug if slug not taken in a db


