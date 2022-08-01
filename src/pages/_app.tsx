import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { MantineProvider } from '@mantine/core'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <MantineProvider withGlobalStyles>
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  )
}

export default MyApp
