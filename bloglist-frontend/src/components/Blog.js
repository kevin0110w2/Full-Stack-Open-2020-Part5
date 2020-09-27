import React, { useState } from 'react'

const Blog = ({ blog, updateLike, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // useImperativeHandle(ref, () => {
  //   return {
  //     toggleVisibility
  //   }
  // })

  const addLike = ({ blog }) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    updateLike(updatedBlog)
  }

  const deleteABlog = ({ blog }) => {
    console.log('blog to delete', blog)
    deleteBlog(blog)
  }

  const showButton = () => {

    if (visible) {
      return (
        <button className="blog-viewButton" onClick={toggleVisibility}>hide</button>
      )
    }

    return (
      <button className="blog-viewButton" onClick={toggleVisibility}>view</button>
    )
  }

  const showDetails = () => {
    if (visible) {
      if (blog.user.username === user.username) {
      return (
        <div>
          <p className="blog-url">{blog.url}</p>
          <p className="blog-likes">likes <span className="blog-likes-value">{blog.likes}</span><button className="blog-likeButton" onClick={() => addLike({ blog })}>like</button></p>
          <p className="blog-username">{blog.user.name}</p>
          <button className="blog-deleteButton" onClick={() => deleteABlog({ blog })}>remove</button>
        </div>
      )
    } 
      return (
        <div>
          <p className="blog-url">{blog.url}</p>
          <p className="blog-likes">likes {blog.likes}<button className="blog-likeButton" onClick={() => addLike({ blog })}>like</button></p>
          <p className="blog-username">{blog.user.name}</p>
        </div>
      )
    }
  }

  return (
    <div style={blogStyle} className="blog">
        {blog.title} {blog.author}
        {showButton()}
        {showDetails()}
    </div>
  )
}

export default Blog
