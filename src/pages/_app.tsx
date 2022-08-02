import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { MantineProvider } from '@mantine/core'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <MantineProvider>
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  )
}

export default MyApp


//BUG:
// nextjs 12.2 styles from mantine flickering
// downgrade to 12.1.6 => diff middleware should be used