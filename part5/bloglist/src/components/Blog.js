import Togglable from './Togglable'
import PropTypes from 'prop-types'
import { useRef } from 'react'

const Blog = ({ blog, incLike, deleteBlog }) => {
  const blogRef = useRef()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className="blog" style={blogStyle}>
      {blog.title} {blog.author}
      <Togglable buttonLabel='show details' ref={blogRef}>
        <p>
					likes: {blog.likes} <button onClick={() => incLike(blog)}>like</button>
        </p>
        <p className="url">
          {blog.url}
        </p>
        <p className="username">
          {blog.user.username}
        </p>
      </Togglable>
      <button onClick={() => deleteBlog(blog)}>remove</button>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  incLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired
}

export default Blog
