import PropTypes from 'prop-types'
import React, { useState, useMemo, useRef } from 'react'
import useOutsideClick from '@/hooks/useOutsideClick'

function PositionedModal({
  setShowModal,
  show,
  e,
  children,
}: PropTypes.InferProps<typeof PositionedModal.propTypes>) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useMemo(() => {
    if (!e) return
    const { clientX, clientY } = e
    setPosition({ top: clientY, left: clientX + 40 })
  }, [e])

  useOutsideClick(ref, () => {
    setShowModal(false)
  })

  if (!show) return null

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex: 1000,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      {children}
    </div>
  )
}

PositionedModal.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  e: PropTypes.shape({
    clientX: PropTypes.number.isRequired,
    clientY: PropTypes.number.isRequired,
  }).isRequired,
  children: PropTypes.element.isRequired,
}

export default PositionedModal
