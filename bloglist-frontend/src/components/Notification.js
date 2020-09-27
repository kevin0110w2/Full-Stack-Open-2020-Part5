import React from 'react'

const Notification = ({ message }) => {
  if (message === null || !message) {
    return null
  }
  return (
    <div className="success">
      {message}
    </div>
  )
}

const ErrorNotification = ({ errorMessage }) => {
    if (errorMessage === null || !errorMessage) {
      return null
    }
    return (
      <div className="error">
        {errorMessage}
      </div>
    )
  }

export default { Notification, ErrorNotification }