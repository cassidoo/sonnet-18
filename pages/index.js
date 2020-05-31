import Head from "next/head";
import { useState } from "react";
import RepoField from "../components/RepoField";

export default function Home() {
  let [numRepos, setNumRepos] = useState(2);
  return (
    <div className="container">
      <Head>
        <title>Sonnet 18 | Repo Comparison</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Add at least 2 GitHub repo URLs:
      {[...Array(numRepos)].map(() => {
        return <RepoField />;
      })}
      <button
        onClick={() => {
          setNumRepos(numRepos + 1);
        }}
      >
        + Add another repo URL
      </button>
    </div>
  );
}
