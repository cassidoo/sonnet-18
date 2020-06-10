import Link from 'next/link'

export default function Custom404() {
  return (
    <main>
      <h1>Sonnet 18</h1>
      How the heck did you get here? Go ahead and{' '}
      <Link href="/">
        <a className="goback">go home</a>
      </Link>
      .
    </main>
  )
}
