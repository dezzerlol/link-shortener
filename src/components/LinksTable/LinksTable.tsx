import { ActionIcon, Pagination, Table } from '@mantine/core'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { LinkType } from '../../pages'
import fetcher from '../../services/fetcher'
import { getDate } from '../../services/getDate'

const LinksTable = ({ links, setLinks }: { links: LinkType[]; setLinks: any }) => {
  const linksPerPage = 5
  const [portion, setPortion] = useState({ min: 0, max: 5 })
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  let total = Math.ceil(links.length / linksPerPage)

  const handleRemove = async (linkId: any) => {
    const body = { linkId }
    await fetcher('/remove-user-link', body)
    setLinks((state: any) => state.filter((link: any) => link.id !== linkId))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    let indexOfLastLink = page * linksPerPage // index of last link. e.g.: 1 page * 5 linksPerPage = 5
    let indexOfFirstLink = indexOfLastLink - linksPerPage // index of first link. e.g.: 5 index - 5 = 0
    setPortion({ min: indexOfFirstLink, max: indexOfLastLink })
  }

  useEffect(() => {
    const getLinks = async () => {
      setIsLoading(true)
      const data = await fetcher('/get-user-links')
      setLinks(data)
      setIsLoading(false)
    }

    getLinks()
  }, [])

  return (
    <>
      <Table
        sx={{
          height: '80%',
          width: '100%',
          tableLayout: 'fixed',
          backgroundColor: 'white',
          borderRadius: '5px',
          boxShadow:
            '0 1px 3px rgb(0 0 0 / 5%), rgb(0 0 0 / 5%) 0px 20px 25px -5px, rgb(0 0 0 / 4%) 0px 10px 10px -5px',
        }}
        fontSize='xs'>
        <thead>
          <tr>
            <th>Link</th>
            <th>Shortened Link</th>
            <th>Created at</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {/* Sort array by date, slice to portion size and then map */}
          {links
            .sort((a, b) => {
              return b.createdAt < a.createdAt ? -1 : b.createdAt > a.createdAt ? 1 : 0
            })
            .slice(portion.min, portion.max)
            .map((link) => (
              <tr key={link.id}>
                <td style={{ overflow: 'hidden', wordWrap: 'break-word' }}>
                  <a href={link.url}>{`${link.url.slice(0, 50)}${link.url.split('').length > 50 ? '...' : ''}`}</a>
                </td>
                <td style={{ overflow: 'hidden', wordWrap: 'break-word' }}>
                  <Link href={`${window.location.origin}/${link.slug}`}>
                    <a rel='norefferer' target='_blank'>
                      {window.location.origin}/{link.slug}
                    </a>
                  </Link>
                </td>
                <td>{getDate(link.createdAt)}</td>
                <td>
                  <ActionIcon variant='transparent' onClick={() => handleRemove(link.id)}>
                    <IoClose />
                  </ActionIcon>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Pagination sx={{ minHeight: '10%' }} page={currentPage} onChange={handlePageChange} total={total} />
    </>
  )
}

export default LinksTable
