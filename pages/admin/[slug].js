import styles from './../../styles/Admin.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import AuthGuard from '../../comopnents/AuthGuard'
import { auth, firestore, serverTimestamp } from '../../lib/firebase'
import { useForm } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import { useState } from 'react'
import toast from 'react-hot-toast'
import ImageUploader from '../../comopnents/ImageUploader'

const AdminPostPage = () => {
  return (
    <main>
      <AuthGuard>
        <PostManager />
      </AuthGuard>
    </main>
  )
}

function PostManager() {
  const [preview, setPreview] = useState(false)

  // grab slug from url
  const router = useRouter()
  const { slug } = router.query

  const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug)
  const [post] = useDocumentDataOnce(postRef)

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  )
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch, formState, errors } = useForm({ defaultValues, mode: 'onChange' })
  const { isValid, isDirty } = formState

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    })

    reset({ content, published })

    toast.success('Post updated successfully!')
  }

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />
        <textarea
          name="content"
          {...register('content', { required: true, maxLength: 20000, minLength: 10 })}
        ></textarea>

        <fieldset>
          <input className={styles.checkbox} name="published" type="checkbox" {...register('published')} />
          <label>Published</label>
        </fieldset>

        <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </div>
    </form>
  )
}

export default AdminPostPage
