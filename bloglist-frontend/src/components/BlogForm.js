import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setURL] = useState('')

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    const handleAuthorChange = (event) => {
        setAuthor(event.target.value)
    }

    const handleURLChange = (event) => {
        setURL(event.target.value)
    }

    const addBlog = (event) => {
        event.preventDefault()
        const blogObject = {
            title: title,
            author: author,
            url: url,
        }
        createBlog({
            blogObject
        })
        setTitle('')
        setAuthor('')
        setURL('')
    }

    return (
        <div className="formDiv">
            <h2>create new</h2>
            <form onSubmit={addBlog}>
                <div>
                    title:
        <input
                        id='title'
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                    />
                </div>
                <div>
                    author:
        <input
                        id='author'
                        type="text"
                        value={author}
                        onChange={handleAuthorChange}
                    />
                </div>
                <div>
                    url:
        <input
                        id='url'
                        type="url"
                        value={url}
                        onChange={handleURLChange}
                    />
                </div>
                <button id="blogform-create" type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm