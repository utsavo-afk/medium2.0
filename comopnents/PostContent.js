import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

const PostContent = ({ post }) => {
  return (
    <div className="card">
      <h1>{JSON.stringify(post?.title)}</h1>
      <span className="text-sm">
        Written by{' '}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{' '}
        on TIME_STAMP
      </span>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  )
}

export default PostContent
