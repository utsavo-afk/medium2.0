import Head from 'next/head'

export default function Metatags({
  title = 'NExtjs + Firebase Dev2.0',
  description = 'A complete Next.js + Firebase app inspired by Fireship.io',
  image = 'https://www.codingninjas.com/codestudio/library/environment-variables-in-next-js',
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@utsavo-afk" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  )
}
