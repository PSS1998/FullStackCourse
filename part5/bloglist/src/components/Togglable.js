import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const showLogin = { display: visible ? 'none' : '' }
  const showBlog = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={showLogin}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showBlog} className="togglableContent">
        {props.children}
        <button onClick={toggleVisibility}>hide</button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable
