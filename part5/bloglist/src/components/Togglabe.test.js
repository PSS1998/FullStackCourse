import Togglable from './Togglable'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

test('renders details when clicking expand button', () => {
  let { container } = render(
    <Togglable buttonLabel="show...">
      <div className="testDiv" >
          togglable content
      </div>
    </Togglable>
  )

  const button = screen.getByText('show...')
  userEvent.click(button)

  const div = container.querySelector('.togglableContent')

  const username = div.querySelector('.username')
  expect(username).toBeDefined()
  const url = div.querySelector('.url')
  expect(url).toBeDefined()
})


