import styles from './../../styles/Post.module.css'
import { firestore, getUserByUsername, postToJSON } from '../../lib/firebase'
import PostContent from '../../comopnents/PostContent'
// to hydrate the doc with realtime db data
import { useDocumentData } from 'react-firebase-hooks/firestore'
import Metatags from '../../comopnents/Metatags'
import AuthGuard from '../../comopnents/AuthGuard'
import Link from 'next/link'
import FireHeartButton from './../../comopnents/FireHeartButton'

//  page built in advance using SSG, data fetched at build time
// can cache easily on cdn for high performance
// !! content wont be updated if theres a change in db data
// ISR comes to the rescue -> trigger page rebuild on server
// user served the the latest build of this page with fresh data
// revalidate prop triggers ISR
export async function getStaticProps({ params }) {
  const { username, slug } = params
  const userDoc = await getUserByUsername(username)

  let post
  let path

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug)
    post = postToJSON(await postRef.get())
    path = postRef.path

    return {
      props: { post, path },
      revalidate: 5000,
    }
  }
}

// tell NEXT what to pre-render
export async function getStaticPaths() {
  const snapshot = await firestore.collectionGroup('posts').get()

  // paths to pre-render
  const paths = snapshot.docs.map(doc => {
    const { username, slug } = doc.data()
    return {
      params: { username, slug },
    }
  })
  return {
    /**
     * paths: [{params: {username, slug}}...]
     */
    paths,
    // incase page has not been pre-rendered yet fallback to ssr
    fallback: 'blocking',
  }
}

const Post = props => {
  const postRef = firestore.doc(props.path)
  const realTimePost = useDocumentData(postRef)
  const post = realTimePost[0] || props.post

  return (
    <main className={styles.container}>
      <Metatags title={`${post.title}`} />
      <section>
        <PostContent post={post} />
      </section>
      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} ❤️‍🔥</strong>
        </p>
        <AuthGuard
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <FireHeartButton postRef={postRef} />
        </AuthGuard>
      </aside>
    </main>
  )
}

export default Post
