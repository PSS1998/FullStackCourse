import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

const blog = {
  title: 'Title',
  author: 'Parsa',
  url: 'google.com',
  user: {
    username: 'root',
    name: 'Parsa'
  }
}

test('renders blog content but not details', () => {
  const { container } = render(<Blog blog={blog}
    incLike={() => (console.log('incrementing like!'))}
    deleteBlog={() => console.log()} />)

  let element = screen.findByText('Title')
  expect(element).toBeDefined()

  element = screen.findByText('Parsa')
  expect(element).toBeDefined()

  let div = container.querySelector('.togglableContent')
  expect(div).toHaveStyle('display: none')
})


test('renders url and likes when clicking button', async () => {
  const mockHandler = jest.fn()
  const user = userEvent.setup()

  const component = render(<Blog blog={blog}
    incLike={() => (console.log('updating like!'))}
    deleteBlog={() => console.log()} />)

  const button = component.getByText('show details')
  await user.click(button)

  const likes = component.getByText('likes:')
  expect(likes).toBeDefined()
  const url = component.getByText('google.com')
  expect(url).toBeDefined()

  const like = await component.findByText('like')

  const bound = mockHandler.bind(user.click(like))

  await bound()
  await bound()
  expect(mockHandler.mock.calls).toHaveLength(2)
})



