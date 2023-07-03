import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [loginVisible, setLoginVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification('wrong credentials')
      setIsSuccess(false)
      setTimeout(() => {
        setNotification(null)
        setIsSuccess(false)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedInUser')
    setUsername('')
    setPassword('')
  }

  const addBlogForm = () => (
    <BlogForm
      setNotification={setNotification}
      setIsSuccess={setIsSuccess}
      setBlogs={setBlogs}
      blogs={blogs}
    />
  )

  const incLike = (blog) => {
    const likes = blog.likes ? blog.likes + 1 : 0
    blogService.update(blog.id, { title: blog.title, author: blog.author, url: blog.url, likes: likes }).then(() => {
      blog.likes += 1
      setBlogs(blogs.filter(n => n.id !== blog.id).concat(blog))
    })
  }

  const deleteBlog = (blog) => {
    const conf = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if(conf) {
      blogService.remove(blog.id).then(() => {
        setBlogs(blogs.filter(n => n.id !== blog.id))
      })
    }
  }


  const loginForm = () => {
    const showLogin = { display: loginVisible ? 'none' : '' }
    const showBlog = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={showLogin}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showBlog}>
          <form onSubmit={handleLogin}>
            <div>
                username
              <input
                type="text"
                value={username}
                name="Username"
                className="username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
                password
              <input
                type="password"
                value={password}
                name="Password"
                className="password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type="submit">login</button>
          </form>
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
  console.log(sortedBlogs)
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} isSuccess={isSuccess}/>
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in <button onClick={(event) => handleLogout(event)}>logout</button>  </p>
          {addBlogForm()}
        </div>
      }
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} incLike={incLike} deleteBlog={deleteBlog}/>
      )}
    </div>
  )
}

export default App
