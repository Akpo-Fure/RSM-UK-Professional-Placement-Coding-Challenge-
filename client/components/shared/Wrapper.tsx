import React from 'react'
import PropTypes from 'prop-types'

export function OverflowWrapper({
  children,
  minWidth,
}: PropTypes.InferProps<typeof OverflowWrapper.propTypes>) {
  return (
    <div
      style={{
        overflowX: 'auto',
        width: 'auto',
      }}
    >
      <div
        style={{
          minWidth: minWidth || '100%',
        }}
      >
        {children}
      </div>
    </div>
  )
}

OverflowWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  minWidth: PropTypes.string,
}
