import React from 'react'
import PropTypes from 'prop-types'

export default function Note({ id, content }) {
  return (
    <div id={`note-${id}`}className="note">{content}</div>
  )
}

Note.propTypes = {
  id: PropTypes.number,
  content: PropTypes.string
}

