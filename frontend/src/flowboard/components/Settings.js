import { useContext } from 'react'
import { YjsContext } from '../../room/components/Room'

const Settings = () => {
  const { yDoc } = useContext(YjsContext);

  const setVariant = (variant) => {
    yDoc.getMap('settings').set('variant', variant);
  }

  return (
    <div className="absolute top-1/2 -translate-y-1/2 ml-16 p-3 w-48 h-64 bg-gray-900 bg-opacity-90 text-white border-none rounded shadow-md flex flex-col justify-top">
      <span className='text-xl mb-1'>Settings</span>
      <p className='text-sm leading-relaxed mb-1'>
        Change background (may have a short delay):
      </p>
      <div className='flex flex-row justify-between mx-2'>
        <button
          className='underline text-white hover:text-gray-400'
          onClick={() => setVariant('lines')}
        >
          Lines
        </button>
        <button
          className='underline text-white hover:text-gray-400'
          onClick={() => setVariant('dots')}
        >
          Dots
        </button>
        <button
          className='underline text-white hover:text-gray-400'
          onClick={() => setVariant('cross')}
        >
          Cross
        </button>
      </div>
    </div>
  )
}

export default Settings