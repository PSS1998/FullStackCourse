import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const setBlogs = jest.fn()
  const setNotification = jest.fn()
  const setIsSuccess = jest.fn()
  let blogs = []

  const mockHandler = jest.fn()

  render(<BlogForm
    setBlogs={setBlogs}
    setNotification={setNotification}
    setIsSuccess={setIsSuccess}
    blogs={blogs}
  />)

  const form = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')

  await userEvent.type(form[0], 'title' )
  await userEvent.type(form[1], 'parsa' )
  await userEvent.type(form[2], 'google.com' )

  const bound = mockHandler.bind(userEvent.click(sendButton))

  bound()
  expect(mockHandler.mock.calls).toHaveLength(1)
})
