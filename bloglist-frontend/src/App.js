import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const blogFormRef = useRef()
  // const blogRef = useRef()

  const sortBlogsByLikes = (a, b) => {
    return b.likes - a.likes;
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort(sortBlogsByLikes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage("wrong credentials")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('logging out with', user.username, user.password)
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const addBlog = async ({ blogObject }) => {
    try {
      blogFormRef.current.toggleVisibility()
      const response = await blogService.create(blogObject)
      setBlogs((blogs.concat(response)).sort(sortBlogsByLikes))
      setMessage(`${blogObject.title} by ${blogObject.author}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)

    } catch (exception) {
      setErrorMessage('Incorrect Blog Details')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateLike = async (blogObject) => {
    const updateData = {
      user: blogObject.user.id,
      likes: blogObject.likes,
      author: blogObject.author,
      title: blogObject.title,
      url: blogObject.url,
    }
    try {
      // blogRef.current.toggleVisibility()
      await blogService.update(blogObject.id, updateData)
      const newBlogs = blogs.filter(blog => blog.id !== blogObject.id)
      setBlogs((newBlogs.concat(blogObject)).sort(sortBlogsByLikes))
    } catch (exception) {
      setErrorMessage('Incorrect Blog Details')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      // blogRef.current.toggleVisibility()
      if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) {
        await blogService.deleteBlog(blogObject.id)
        const newBlogs = blogs.filter(blog => blog.id !== blogObject.id)
        setBlogs(newBlogs.sort(sortBlogsByLikes))
      }
    } catch (exception) {
      setErrorMessage('Invalid blog deetz')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button id="loginbutton-main" onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button id="cancelButton-main" onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const welcomeScreen = () => {
    return (
      <div>
        <p>{user.name} logged in <button className="app-logoutButton" type="submit" onClick={handleLogout}>logout</button></p>
        <Togglable buttonLabel='create new blog' ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateLike={updateLike} deleteBlog={deleteBlog} user={user} />
        )}
      </div>
    )
  }

  return (
    <div>
      {user === null ? <h2>log in to application</h2> : <h2>blogs</h2>}
      <Notification.Notification message={message} />
      <Notification.ErrorNotification errorMessage={errorMessage} />

      {user === null ? loginForm() : welcomeScreen()}

    </div>
  )
}

export default App