import React from 'react'

const Cursor = ({ cursor }) => {
  return (
    <div className='w-5 h-5 absolute opacity-70' style={{left: `${cursor.x}px`, top: `${cursor.y}px` }}>
        <div className='absolute -top-1 -left-1 rounded-full bg-black h-3 w-3' ></div>
        <span className='absolute text-xs -right-1 w-3'>{cursor.username ? cursor.username : cursor.userId}</span>
    </div>
  )
}

export default Cursor