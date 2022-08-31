import { ActionIcon, Box, Button, Input, Radio, TextInput, Title, Tooltip } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { CgSidebarOpen } from 'react-icons/cg'
import { IoClose } from 'react-icons/io5'
import Header from '../components/Header/Header'
import fetcher from '../services/fetcher'
import dynamic from 'next/dynamic'
import { checkValidUrl } from '../services/checkValidUrl'

const LinksTable = dynamic(() => import('../components/LinksTable/LinksTable'), { ssr: true })

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
  const [error, setError] = useState(false)
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [links, setLinks] = useState<Array<LinkType>>([])
  const [opened, setOpened] = useState(false)

  const handleSubmit = async () => {
    if (checkValidUrl(url)) {
      setIsLoading(true)
      const response = await fetcher(`/create-url`, { url })
      setIsLoading(false)
      setLinks((state) => [...state, response]) // add response link to array of links
      setShortenedUrl(`${window.location.origin}/${response.slug}`)
    } else {
      setError(true)
    }

    setError(false)
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
        <Box
          sx={{
            height: '40%',
            fontSize: '1.8rem',
            display: 'flex',
            flexDirection: 'column',
            width: 'clamp(300px, 80vw, 700px)',
          }}>
          <Title sx={{ color: '#00a7ca' }} pl='0.5rem' order={1}>
            Shorten your link
          </Title>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
              maxHeight: '64px',
              height: '100%',
              flexDirection: largeScreen ? 'row' : 'column',
            }}>
            <Tooltip
              label='Invalid url. Add http/https or change url.'
              opened={error ? true : false}
              position='bottom-start'
              withArrow>
              <TextInput
                variant='unstyled'
                size='lg'
                placeholder='Input your url...'
                onChange={(e: any) => {
                  setUrl(e.target.value)
                }}
                sx={{
                  width: '90%',
                  border: 0,
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  paddingLeft: '0.5rem',
                }}
                value={url}
                rightSection={
                  url && (
                    <ActionIcon onClick={() => setUrl('')}>
                      <IoClose size={18} style={{ display: 'block', opacity: 0.5 }} />
                    </ActionIcon>
                  )
                }
              />
            </Tooltip>

            <Button
              loading={isLoading}
              onClick={handleSubmit}
              size={largeScreen ? 'md' : 'xs'}
              mt={largeScreen ? 0 : 'lg'}
              ml='1rem'
              sx={{ width: largeScreen ? '20%' : '30%', height: '100%' }}>
              Shorten!
            </Button>
          </Box>

          {shortenedUrl && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem',
                width: 'clamp(300px, 80vw, 700px)',
                flexDirection: largeScreen ? 'row' : 'column',
              }}>
              <TextInput
                placeholder='Your shortened url'
                readOnly
                variant='unstyled'
                size='lg'
                defaultValue={shortenedUrl}
                sx={{
                  width: '90%',
                  border: 0,
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  paddingLeft: '0.5rem',
                }}
                rightSection={
                  shortenedUrl && (
                    <Tooltip label='Open in a new tab' position='bottom-end' withArrow>
                      <ActionIcon onClick={() => window.open(shortenedUrl, '_blank')?.focus()}>
                        <CgSidebarOpen size={18} style={{ display: 'block', opacity: 0.5 }} />
                      </ActionIcon>
                    </Tooltip>
                  )
                }
              />

              <Tooltip opened={opened} label='URL copied'>
                <Button
                  size={largeScreen ? 'lg' : 'xs'}
                  ml='1rem'
                  onClick={handleCopy}
                  sx={{ width: largeScreen ? '20%' : '30%' }}>
                  Copy
                </Button>
              </Tooltip>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            height: '100%',
            display: 'flex',
            width: `${largeScreen ? '70%' : '100%'}`,
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
