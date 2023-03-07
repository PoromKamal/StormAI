import React from 'react'

const Cursor = () => {
  return (
    <div className='w-5 h-5 relative'>
        <div className='absolute -top-1 -left-1 rounded-full bg-black h-3 w-3'></div>
        <span className='absolute text-xs -right-1 w-3'>Userid</span>
    </div>
  )
}

export default Cursor