import React from 'react'
import PropTypes from 'prop-types'

function Divider({
  thick = 2,
  color,
  isVertical,
  margin,
}: PropTypes.InferProps<typeof Divider.propTypes>) {
  return (
    <div
      style={{
        width: isVertical ? `${thick}px` : '100%',
        height: isVertical ? '100%' : `${thick}px`,
        backgroundColor: color ?? '#F2F4F7',
        margin: margin ?? 0,
      }}
    />
  )
}

Divider.propTypes = {
  thick: PropTypes.number,
  color: PropTypes.string,
  isVertical: PropTypes.bool,
  margin: PropTypes.string,
}

export default Divider
