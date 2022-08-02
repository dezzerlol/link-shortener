import { Box, Button, Menu, Popover, Skeleton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { signIn, signOut, useSession } from 'next-auth/react'
import styles from './style.module.css'

const Header = () => {
  const { data: session, status } = useSession()
  const [opened, { close, open }] = useDisclosure(false)

  if (status === 'loading') {
    return (
      <div className={styles.header}>
        <Skeleton height={36} width={90} />
      </div>
    )
  }

  return (
    <div className={styles.header}>
      {session ? (
        <>
          <Menu shadow='md' width={200}>
            <Menu.Target>
              <Button>Account</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item disabled>{session.user?.email}</Menu.Item>
              <Menu.Item onClick={() => signOut()}>Logout</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Popover width={200} position='bottom' withArrow shadow='md' opened={opened}>
            <Popover.Target>
              <Button sx={{}} size='xs' onClick={() => signIn('github')} onMouseEnter={open} onMouseLeave={close}>
                Continue with GitHub
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Box>Sign in to get list of all your shortened links</Box>
            </Popover.Dropdown>
          </Popover>
        </Box>
      )}
    </div>
  )
}

export default Header
