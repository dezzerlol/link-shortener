import { Box, Button, Popover, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import LinksTable from '../components/LinksTable/LinksTable'
import fetcher from '../services/fetcher'
import styles from '../styles/Home.module.css'

export type LinkType = {
  createdAt: string
  id: number
  slug: string
  url: string
  userId: string
}

const Home: NextPage = () => {
  const largeScreen = useMediaQuery('(min-width: 1024px)')
  const { data: session } = useSession()
  const [url, setUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [links, setLinks] = useState<Array<LinkType>>([])

  const handleSubmit = async () => {
    setIsLoading(true)
    const response = await fetcher(`/create-url`, { url })
    setIsLoading(false)
    setLinks((state) => [...state, response]) // add response link to array of links
    setShortenedUrl(`${window.location.origin}/${response.slug}`)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortenedUrl)
  }

  useEffect(() => {
    const getLinks = async () => {
      if (session) {
        const data = await fetcher('/get-user-links')
        setLinks(data)
      }
    }

    getLinks()
  }, [session])

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.form__container}>
        <h1 className={styles.container__title}>Shorten your link:</h1>
        <div className={styles.url__form}>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
            <input
              placeholder='Input your url...'
              className={styles.url__input}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button
              loading={isLoading}
              onClick={handleSubmit}
              size={largeScreen ? 'md' : 'xs'}
              ml='1rem'
              sx={{ width: '20%' }}>
              Shorten!
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
            <input
              placeholder='Your shortened url'
              className={styles.url__input}
              readOnly
              defaultValue={shortenedUrl}
            />

            <Popover width={110} position='bottom' withArrow shadow='md'>
              <Popover.Target>
                <Button size={largeScreen ? 'md' : 'xs'} ml='1rem' onClick={handleCopy} sx={{ width: '20%' }}>
                  Copy
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Text size='sm'>URL copied</Text>
              </Popover.Dropdown>
            </Popover>
          </Box>
        </div>
        <div
          style={{
            height: '40%',
            display: 'flex',
            width: `${largeScreen ? '60%' : '100%'}`,
            marginTop: `${largeScreen ? '5rem' : '10rem'}`,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <LinksTable links={links} setLinks={setLinks} />
        </div>
      </div>
    </div>
  )
}

export default Home
