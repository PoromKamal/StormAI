import { useContext } from 'react'
import { YjsContext } from '../../room/components/Room'

const Invite = () => {
  const { yDoc } = useContext(YjsContext);

  return (
    <div className="absolute top-1/2 -translate-y-1/2 ml-16 p-3 w-48 h-64 bg-gray-900 bg-opacity-90 text-white border-none rounded shadow-md flex flex-col justify-top">
      <span className='text-xl mb-1'>Invite</span>
      <p className='text-sm leading-relaxed mb-1'>
        Invite others with the code below:
      </p>
      <p className='text-sm leading-relaxed mb-1 break-all'>
        {yDoc.getMap('roomInfo').get('info')._id}
      </p>
      <p className='text-sm leading-relaxed mb-1'>
        Or share the link below:
      </p>
      <p className='text-sm leading-relaxed mb-1 break-all'>
        {`http://localhost:3000/invite/${yDoc.getMap('roomInfo').get('info')._id}`}
      </p>
    </div>
  )
}

export default Invite