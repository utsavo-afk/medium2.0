import { useState } from 'react'
import Metatags from '../comopnents/Metatags'
import PostFeed from '../comopnents/PostFeed'
import { firestore, postToJSON, fromMillis } from '../lib/firebase'
import Loader from './../comopnents/Loader'
// define global posts limit which are ssr'd
const MAX_LIMIT = 10

export async function getServerSideProps() {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(MAX_LIMIT)

  const posts = (await postsQuery.get()).docs.map(postToJSON)

  return {
    props: { posts },
  }
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts)
  const [loading, isLoading] = useState(false)
  const [feedEnd, setFeedEnd] = useState(false)

  const getMorePosts = async () => {
    isLoading(true)
    const last = posts[posts.length - 1]
    const pointer = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt
    const query = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(pointer)
      .limit(MAX_LIMIT)

    const newPosts = (await query.get()).docs.map(doc => doc.data())
    setPosts(posts.concat(newPosts))
    isLoading(false)

    // no more pagination
    if (newPosts.length < MAX_LIMIT || !newPosts.length) {
      setFeedEnd(true)
    }
  }
  return (
    <main>
      <Metatags title="Landing Page" />
      <PostFeed posts={posts} />
      {!loading && !feedEnd && <button onClick={getMorePosts}>Load More</button>}
      <Loader show={loading} />
      {feedEnd && 'You have reached the end.'}
    </main>
  )
}
