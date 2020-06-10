function Error({ statusCode }) {
  return (
    <main>
      <h1>Sonnet 18</h1>
      {statusCode === 500 ? (
        <div>
          Oopsies. Try refreshing the page! Chances are if you've gotten here,
          there's an issue with how Next.js and next-on-netlify work together to
          generate new routes.
        </div>
      ) : (
        `An error occurred.`
      )}
    </main>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
