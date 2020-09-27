import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders content ', () => {
  const blog = {
    "title": "How to Lose Friends and Alienate People",
    "author": "Hugh Jackman",
    "url": "www.something.com",
    "likes": 13,
    "userId": "5f6769f430a42d3490be0429"
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent(
    'Hugh Jackman'
  )
  expect(component.container).toHaveTextContent(
    'How to Lose Friends and Alienate People'
  )
  expect(component.container).not.toHaveTextContent(
    '13'
  )
  expect(component.container).not.toHaveTextContent(
    'www.something.com'
  )
})

test('clicking the show button shows extra blog details', () => {
  const blog = {
    _id: "5a43fde2cbd20b12a2c34e91",
    user: {
      _id: "5a43e6b6c37f3d065eaaa581",
      username: "mluukkai",
      name: "Matti Luukkainen"
    },
    likes: 0,
    author: "Joel Spolsky",
    title: "The Joel Test: 12 Steps to Better Code",
    url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
  }

  const updateLike = jest.fn()
  const user = jest.fn()
  const deleteBlog = jest.fn()
  const component = render(
    <Blog blog={blog} user={user} updateLike={updateLike} deleteBlog={deleteBlog} />
  )

  const viewButton = component.getByText('view')
  fireEvent.click(viewButton)

  const blogUrlDiv = component.container.querySelector('.blog-url')
  expect(blogUrlDiv).toHaveTextContent(
    'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/'
  )

  const blogLikesDiv = component.container.querySelector('.blog-likes')
  expect(blogLikesDiv).toHaveTextContent(
    '0'
  )

  const blogUsernameDiv = component.container.querySelector('.blog-username')
  expect(blogUsernameDiv).toHaveTextContent(
    'Matti Luukkainen'
  )
})

test('clicking the like button twice fires twice', () => {
  const blog = {
    _id: "5a43fde2cbd20b12a2c34e91",
    user: {
      _id: "5a43e6b6c37f3d065eaaa581",
      username: "mluukkai",
      name: "Matti Luukkainen"
    },
    likes: 0,
    author: "Joel Spolsky",
    title: "The Joel Test: 12 Steps to Better Code",
    url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
  }

  const updateLike = jest.fn()
  const user = jest.fn()
  const deleteBlog = jest.fn()
  const component = render(
    <Blog blog={blog} user={user} updateLike={updateLike} deleteBlog={deleteBlog} />
  )

  const viewButton = component.getByText('view')
  fireEvent.click(viewButton)

  const likeButton = component.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(updateLike.mock.calls).toHaveLength(2)
})