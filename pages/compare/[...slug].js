import { useRouter } from 'next/router'

export function getStaticPaths() {
  return { paths: [], fallback: true }
}

export async function getStaticProps({ params }) {
  const repos = params.slug
  let repoData = []

  console.log(repos)

  for (let repo of repos) {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=repo%3A${encodeURIComponent(
        repo.replace('#', '/')
      )}`
    )
    let data = await response.json()
    repoData.push(data.items[0].stargazers_count)
    console.log(repoData)
  }

  return {
    props: { repos, repoData },

    // Incremental re-generation:
    unstable_revalidate: true,
  }
}

export default function Compare(props) {
  const router = useRouter()
  if (router.isFallback) {
    return (
      <main>
        <p>New comparison! Loading ...</p>
      </main>
    )
  }

  const { repos, repoData } = props
  return (
    <main>
      hi
      {repos}
      {repoData}
    </main>
  )
}
