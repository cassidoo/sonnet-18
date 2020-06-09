import Head from 'next/head'
import { useState, useCallback } from 'react'

export default function Home() {
  let [repos, setRepos] = useState([])

  const onSubmit = useCallback((e) => {
    e.preventDefault()

    let repoStrings = repos.map((repo) => {
      return repo.replace(/^(http|https):\/\/github.com\//i, '').trim()
    })

    let url = repoStrings.map((str) => {
      return `/${encodeURIComponent(str.replace('/', ':'))}`
    })

    console.log(url)

    window.location.href = `/compare${url.join('')}`
  })

  return (
    <div className="container">
      <Head>
        <title>Sonnet 18 | Repo Comparison</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Sonnet 18</h1>
      <h2>Shall I compare thine repo to a summer's day?</h2>
      <p>Add one repo URL per line:</p>
      <form onSubmit={onSubmit}>
        <textarea
          placeholder={`https://github.com/username/test`}
          defaultValue={repos}
          onChange={(event) => {
            let vals = event.target.value.split('\n').filter(function (el) {
              return el.trim() !== ''
            })

            setRepos(vals)
          }}
        />
        <br />
        {repos.length >= 2 && repos.length <= 10 && (
          <button type="submit">COMPARE</button>
        )}
      </form>
    </div>
  )
}
