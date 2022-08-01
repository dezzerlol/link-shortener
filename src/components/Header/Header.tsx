import { Button, Menu } from '@mantine/core'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import styles from './style.module.css'

const Header = () => {
  const { data: session } = useSession()
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
        <>
          <div className={styles.container__text}>Sign in to get list of all your shortened links:</div>

          <button className={`${styles.submit__button}`} onClick={() => signIn('github')}>
            Continue with GitHub
          </button>
        </>
      )}
    </div>
  )
}

export default Header
