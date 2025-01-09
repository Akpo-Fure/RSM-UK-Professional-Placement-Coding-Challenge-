import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

function ResponsiveImage({
  src,
  width,
  height,
  minHeight,
  objectFit = 'contain',
  alt,
  bgColor,
}: PropTypes.InferProps<typeof ResponsiveImage.propTypes>) {
  return (
    <div
      style={{
        width: width ?? '100%',
        position: 'relative',
        height: height ?? '100%',
        backgroundColor: bgColor ?? 'transparent',
        minHeight: minHeight ?? 'auto',
      }}
    >
      <Image
        src={src}
        alt={alt ?? 'icon'}
        style={{
          objectFit: objectFit as
            | 'contain'
            | 'cover'
            | 'fill'
            | 'none'
            | 'scale-down',
        }}
        fill={true}
      />
    </div>
  )
}

ResponsiveImage.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  minHeight: PropTypes.string,
  objectFit: PropTypes.string,
  alt: PropTypes.string,
  bgColor: PropTypes.string,
}

export default ResponsiveImage
