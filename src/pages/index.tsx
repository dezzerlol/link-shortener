import { Box, Button, Input, Popover, Text, Title, Tooltip } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import Header from '../components/Header/Header'
import LinksTable from '../components/LinksTable/LinksTable'
import fetcher from '../services/fetcher'

export type LinkType = {
  createdAt: string
  id: number
  slug: string
  url: string
  userId: string
}

const Home: NextPage = () => {
  const largeScreen = useMediaQuery('(min-width: 1024px)', false)
  const { data: session, status } = useSession()
  const [url, setUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [links, setLinks] = useState<Array<LinkType>>([])
  const [opened, setOpened] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const response = await fetcher(`/create-url`, { url })
    setIsLoading(false)
    setLinks((state) => [...state, response]) // add response link to array of links
    setShortenedUrl(`${window.location.origin}/${response.slug}`)
  }

  const handleCopy = async (e: any) => {
    setOpened(true)
    await navigator.clipboard.writeText(shortenedUrl)

    setTimeout(() => {
      setOpened(false)
    }, 2000)
  }

  return (
    <Box sx={{ width: '100vw', height: '100vh', backgroundColor: '#ebeff3' }}>
      <Header />

      <Box
        sx={{
          height: 'calc(100% - 50px)',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
        <Title sx={{ color: '#00a7ca' }} order={1}>
          Shorten your link:
        </Title>
        <Box sx={{ fontSize: '1.8rem', display: 'flex', flexDirection: 'column', width: 'clamp(400px, 80vw, 700px)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
            <Input
              placeholder='Input your url...'
              onChange={(e: any) => setUrl(e.target.value)}
              sx={{ width: '70%', border: 0, padding: '1rem', borderRadius: '5px' }}
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
            <Input
              placeholder='Your shortened url'
              readOnly
              defaultValue={shortenedUrl}
              sx={{ width: '70%', border: 0, padding: '1rem', borderRadius: '5px' }}
            />

            <Tooltip opened={opened} label='URL copied'>
              <Button size={largeScreen ? 'md' : 'xs'} ml='1rem' onClick={handleCopy} sx={{ width: '20%' }}>
                Copy
              </Button>
            </Tooltip>
          </Box>
        </Box>

        <Box
          sx={{
            height: '40%',
            display: 'flex',
            width: `${largeScreen ? '60%' : '100%'}`,
            marginTop: `${largeScreen ? '5rem' : '10rem'}`,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {status === 'authenticated' && <LinksTable links={links} setLinks={setLinks} />}
        </Box>
      </Box>
    </Box>
  )
}

export default Home
