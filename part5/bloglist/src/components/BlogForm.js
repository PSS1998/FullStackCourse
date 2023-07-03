import blogService from '../services/blogs'
import PropTypes from 'prop-types'
import { useState } from 'react'

const BlogForm = ({ setIsSuccess, setNotification, setBlogs, blogs }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
      likes: 0,
    }

    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
        setIsSuccess(true)
        setNotification(`a new blog ${blogTitle} by ${blogAuthor} was added`)

        setBlogTitle('')
        setBlogAuthor('')
        setBlogUrl('')
        setTimeout(() => {
          setNotification(null)
          setIsSuccess(false)
        }, 5000)
      })
      .catch(() => {
        setIsSuccess(false)
        setNotification('missing fields')
        setTimeout(() => {
          setNotification(null)
          setIsSuccess(false)
        }, 5000)
      })
  }

  return (
    <form className="blogForm" onSubmit={addBlog}>
      <div>
        title:
        <input
          type="text"
          value={blogTitle}
          name="Title"
          className="title"
          onChange={({ target }) => setBlogTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={blogAuthor}
          name="Author"
          className="author"
          onChange={({ target }) => setBlogAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={blogUrl}
          name="Url"
          className="url"
          onChange={({ target }) => setBlogUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

BlogForm.propTypes = {
  blogs: PropTypes.arrayOf(Object).isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
  setBlogs: PropTypes.func.isRequired,
}

export default BlogForm
