import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('BlogForm event handler receives right props', () => {
    const createBlog = jest.fn()

    const component = render(
        <BlogForm createBlog={createBlog} />
    )

    const titleInput = component.container.querySelector('#title')
    const authorInput = component.container.querySelector('#author')
    const urlInput = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(titleInput, {
        target: { value: 'The Joel Test: 12 Steps to Better Code' }
    })
    fireEvent.change(authorInput, {
        target: { value: 'Joel Spolsky' }
    })
    fireEvent.change(urlInput, {
        target: { value: 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/' }
    })
    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].blogObject.title).toBe('The Joel Test: 12 Steps to Better Code')
    expect(createBlog.mock.calls[0][0].blogObject.author).toBe('Joel Spolsky')
    expect(createBlog.mock.calls[0][0].blogObject.url).toBe('https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/')
})