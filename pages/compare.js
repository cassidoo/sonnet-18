import Link from 'next/link'
import { useRouter } from 'next/router'
import { Octokit } from '@octokit/rest'

export default function Compare(props) {
  const router = useRouter()
  if (router.isFallback) {
    return (
      <main>
        <p>New comparison! Loading...</p>
      </main>
    )
  }

  const formatDate = (isostring) => {
    let date = new Date(isostring)
    const dateTimeFormat = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
    const [
      { value: month },
      ,
      { value: day },
      ,
      { value: year },
    ] = dateTimeFormat.formatToParts(date)

    return `${day} ${month} ${year}`
  }

  const { repoData, repoCommits } = props

  return (
    <main>
      <h1>Sonnet 18</h1>

      <div className="comparisons">
        <h2>
          Comparing <span>{repoData.length}</span> repositories
        </h2>
        <table>
          <thead>
            <tr>
              <th className="lead">Name</th>
              {repoData.map((r) => {
                return (
                  <th key={`name-${r.id}`}>
                    <a href={r.html_url}>{r.name}</a>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="lead">Owner</td>
              {repoData.map((r) => {
                let author = r.owner.login

                return (
                  <td key={`owner-${r.id}`}>
                    <a href={`https://github.com/${author}`} target="_blank">
                      {author}
                    </a>
                  </td>
                )
              })}
            </tr>
            <tr>
              <td className="lead">Stargazers</td>
              {repoData.map((r) => {
                return <td key={`stars-${r.id}`}>{r.stargazers_count}</td>
              })}
            </tr>
            <tr>
              <td className="lead">Created</td>
              {repoData.map((r) => {
                return (
                  <td key={`updated-${r.id}`}>{formatDate(r.created_at)}</td>
                )
              })}
            </tr>
            <tr>
              <td className="lead">Last updated</td>
              {repoData.map((r) => {
                return (
                  <td key={`updated-${r.id}`}>{formatDate(r.pushed_at)}</td>
                )
              })}
            </tr>
            <tr>
              <td className="lead">Open issues</td>
              {repoData.map((r) => {
                return <td key={`issues-${r.id}`}>{r.open_issues_count}</td>
              })}
            </tr>
            <tr>
              <td className="lead">Commits in the last year</td>
              {repoCommits.map((c) => {
                return <td key={`com-${c}`}>{c}</td>
              })}
            </tr>
          </tbody>
        </table>
        <Link href="/">
          <a className="goback">← Do another comparison</a>
        </Link>
      </div>
    </main>
  )
}

Compare.getInitialProps = async ({ query }) => {
  let repos = query.repos.split(',')

  let repoData = []
  let repoCommits = []

  const octokit = new Octokit({
    auth: process.env.GITHUB_KEY,
    userAgent: 'sonnet-18 v1.0.0',
    baseUrl: 'https://api.github.com',
  })

  for (let r of repos) {
    let ownerRepo = r.split('#')

    const repoRes = await octokit.repos.get({
      owner: ownerRepo[0],
      repo: ownerRepo[1],
    })

    repoData.push(repoRes?.data)

    const repoCom = await octokit.repos.getCommitActivityStats({
      owner: ownerRepo[0],
      repo: ownerRepo[1],
    })

    let totals = 0
    repoCom?.data?.map((stat) => {
      totals += stat.total
    })

    repoCommits.push(totals)
  }

  return { repoData, repoCommits }
}
