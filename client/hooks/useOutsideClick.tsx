import PropTypes from 'prop-types'
import React, { useEffect } from 'react'

function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
) {
  useEffect(() => {
    const handleClickOutside = (
      event: React.MouseEvent | MouseEvent | TouchEvent,
    ) => {
      if (ref && ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback])
}

useOutsideClick.propTypes = {
  ref: PropTypes.object.isRequired,
  callback: PropTypes.func.isRequired,
}

export default useOutsideClick
