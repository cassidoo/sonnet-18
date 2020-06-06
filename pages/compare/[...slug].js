import { useRouter } from 'next/router'
import { Octokit } from '@octokit/rest'
import { GITHUB_KEY } from '../../keys'

export function getStaticPaths() {
  return { paths: [], fallback: true }
}

export async function getStaticProps({ params }) {
  const repos = params.slug

  let repoData = []
  let repoCommits = []

  const octokit = new Octokit({
    auth: GITHUB_KEY,
    userAgent: 'sonnet-18 v1.0.0',
    baseUrl: 'https://api.github.com',
  })

  for (let r of repos) {
    let ownerRepo = r.split('#')

    const repoRes = await octokit.repos.get({
      owner: ownerRepo[0],
      repo: ownerRepo[1],
    })

    repoData.push(repoRes.data)

    const repoCom = await octokit.repos.getCommitActivityStats({
      owner: ownerRepo[0],
      repo: ownerRepo[1],
    })

    let totals = 0
    repoCom.data.map((stat) => {
      totals += stat.total
    })

    repoCommits.push(totals)
  }

  return {
    props: { repos, repoData, repoCommits },

    // Incremental re-generation:
    unstable_revalidate: true,
  }
}

export default function Compare(props) {
  const router = useRouter()
  if (router.isFallback) {
    return (
      <main>
        <p>New comparison! Loading...</p>
      </main>
    )
  }

  const { repoData, repoCommits } = props

  return (
    <main>
      <h1>Comparing {repoData.length} repositories</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            {repoData.map((r) => {
              return <th key={`name-${r.id}`}>{r.name}</th>
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Owner</td>
            {repoData.map((r) => {
              return <td key={`owner-${r.id}`}>{r.owner?.login}</td>
            })}
          </tr>
          <tr>
            <td>Stargazers</td>
            {repoData.map((r) => {
              return <td key={`stars-${r.id}`}>{r.stargazers_count}</td>
            })}
          </tr>
          <tr>
            <td>Created</td>
            {repoData.map((r) => {
              return <td key={`updated-${r.id}`}>{r.created_at}</td>
            })}
          </tr>
          <tr>
            <td>Last updated</td>
            {repoData.map((r) => {
              return <td key={`updated-${r.id}`}>{r.pushed_at}</td>
            })}
          </tr>
          <tr>
            <td>Open issues</td>
            {repoData.map((r) => {
              return <td key={`issues-${r.id}`}>{r.open_issues_count}</td>
            })}
          </tr>
          <tr>
            <td>Commits in the last year</td>
            {repoCommits.map((c) => {
              return <td key={`com-${c}`}>{c}</td>
            })}
          </tr>
        </tbody>
      </table>
    </main>
  )
}
