import Head from 'next/head'
import { useState, useCallback } from 'react'

export default function Home() {
  let [repos, setRepos] = useState([])

  const onSubmit = useCallback((e) => {
    e.preventDefault()

    let repoStrings = repos.map((repo) => {
      return repo.replace(/^https:\/\/github.com\//i, '')
    })

    let url = repoStrings.map((str) => {
      return `${encodeURIComponent(str.replace('/', '#'))}`
    })

    window.location.href = `/compare?repos=${url}`
  })

  return (
    <div className="container">
      <Head>
        <title>Sonnet 18 | Repo Comparison</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Add one repo URL per line, up to 5:
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
        {repos.length >= 2 && repos.length <= 5 && (
          <button type="submit">Compare!</button>
        )}
      </form>
    </div>
  )
}
