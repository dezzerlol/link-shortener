import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import fetcher from '../services/fetcher'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState('')

  const handleSubmit = async () => {
    const response = await fetcher(`/create-url`, { url })
    setShortenedUrl(`${window.location.origin}/${response.url}`)
  }

  console.log(router.asPath)

  return (
    <div className={styles.container}>
      <h1 className={styles.container__title}>Shorten your link:</h1>
      <div className={styles.url__form}>
        <input placeholder='Input your url...' className={styles.url__input} onChange={(e) => setUrl(e.target.value)} />
        <button className={styles.submit__button} onClick={handleSubmit}>
          Shorten!
        </button>
        <input placeholder='Your shortened url' className={styles.url__input} readOnly defaultValue={shortenedUrl} />
      </div>

      <div className={styles.container__text}>Sign in to get list of all your shortened links:</div>
      <button className={styles.submit__button}>Continue with GitHub</button>
    </div>
  )
}

export default Home
