import React from 'react'
import Divider from '@/components/shared/Divider'

interface ListModalProps {
  items: React.ReactNode[]
}
const ListModal: React.FC<ListModalProps> = ({ items }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        padding: '10px',
      }}
    >
      {items.map((item, index) => (
        <>
          <div key={index}>{item}</div>
          {items.length - 1 !== index && <Divider />}
        </>
      ))}
    </div>
  )
}

export default ListModal
