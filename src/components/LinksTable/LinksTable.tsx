import { ActionIcon, Pagination, Table } from '@mantine/core'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { LinkType } from '../../pages'
import fetcher from '../../services/fetcher'
import { getDate } from '../../services/getDate'

const LinksTable = ({ links, setLinks }: { links: LinkType[]; setLinks: any }) => {
  const linksPerPage = 5
  const { data: session } = useSession()
  const [portion, setPortion] = useState({ min: 0, max: 5 })
  const [currentPage, setCurrentPage] = useState(1)
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

  if (!session) {
    return <div style={{ marginTop: '3rem' }}>Sign in to save your shortened links.</div>
  }

  if (links.length === 0) {
    return <div style={{ marginTop: '3rem' }}>No saved links...</div>
  }

  return (
    <>
      <Table sx={{ width: '100%', tableLayout: 'fixed' }} fontSize='xs'>
        <thead>
          <tr>
            <th>Link</th>
            <th>Shortened Link</th>
            <th>Created at</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {links.slice(portion.min, portion.max).map((link) => (
            <tr key={link.id}>
              <td style={{ overflow: 'hidden', wordWrap: 'break-word' }}>
                <a href={link.url}>{link.url}</a>
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
      <Pagination pt='1rem' page={currentPage} onChange={handlePageChange} total={total} />
    </>
  )
}

export default LinksTable
