import UserProfile from './../../comopnents/UserProfile'
import PostFeed from './../../comopnents/PostFeed'
import { getUserByUsername, postToJSON } from '../../lib/firebase'
import Metatags from '../../comopnents/Metatags'

//!! use ssr since -> public view -> seo-important -> realtime-page with all posts
export async function getServerSideProps({ query }) {
  const { username } = query

  const userDoc = await getUserByUsername(username)

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    }
  }

  let user = null
  let posts = null

  if (userDoc) {
    user = userDoc.data()
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5)

    posts = (await postsQuery.get()).docs.map(postToJSON)
  }
  // passed to component as props
  return {
    props: { user, posts },
  }
}

const UserProfilePage = ({ user, posts }) => {
  return (
    <main>
      <Metatags title={`${user.username}'s profile page`} />
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}

export default UserProfilePage
