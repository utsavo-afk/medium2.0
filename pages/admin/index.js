import AuthGuard from '../../comopnents/AuthGuard'
import toast from 'react-hot-toast'
import { firestore, auth, serverTimestamp } from '../../lib/firebase'
import { useCollection } from 'react-firebase-hooks/firestore'
import PostFeed from '../../comopnents/PostFeed'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { UserContext } from '../../lib/context'
import kebabcase from 'lodash.kebabcase'

const AdminPostsPage = () => {
  return (
    <main>
      <AuthGuard>
        <PostList />
        <CreateNewPost />
      </AuthGuard>
    </main>
  )
}

function PostList() {
  const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts')
  const query = ref.orderBy('createdAt')
  const [querySnapshot] = useCollection(query)

  const posts = querySnapshot?.docs.map(doc => doc.data())

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin={true} />
    </>
  )
}

function CreateNewPost() {
  const router = useRouter()
  const { username } = useContext(UserContext)
  const [title, setTitle] = useState('')

  // must be URL safe format
  const slug = encodeURI(kebabcase(title))

  // validate title length
  const isValid = title.length > 3 && title.length < 100

  const createPost = async event => {
    event.preventDefault()
    const uid = auth.currentUser.uid
    const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug)

    // !!Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    }

    await ref.set(data)

    toast.success('Post created!')

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`)
  }

  return (
    <form onSubmit={createPost}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="My Awesome Article!" />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  )
}

export default AdminPostsPage
