import { useCallback, useContext, useState } from 'react'
import { YjsContext } from '../../../room/components/Room';
import '../../styles/nodes.css';

const StickyNode = ({ id, data }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { yDoc } = useContext(YjsContext);

  const onChange = useCallback((e) => {
    const currentNode = yDoc.getMap('nodes').get(id);
    yDoc.getMap('nodes').set(id, {
      ...currentNode,
      data: { ...currentNode.data, text: e.target.value },
    });
  }, [])

  const changeColor = useCallback((color) => {
    const currentNode = yDoc.getMap('nodes').get(id);
    if (currentNode.data.color === color) return;
    yDoc.getMap('nodes').set(id, {
      ...currentNode,
      data: { ...currentNode.data, color: color },
    });
  }, [])

  const getDarkColor = (color) => {
    switch (color) {
      case 'red':
        return 'bg-red-200';
      case 'orange':
        return 'bg-orange-200';
      case 'yellow':
        return 'bg-yellow-200';
      case 'green':
        return 'bg-green-200';
      case 'cyan':
        return 'bg-cyan-200';
      case 'indigo':
        return 'bg-indigo-200';
    }
  }

  const getFocusLightColor = (color) => {
    switch (color) {
      case 'red':
        return 'focus:bg-red-100';
      case 'orange':
        return 'focus:bg-orange-100';
      case 'yellow':
        return 'focus:bg-yellow-100';
      case 'green':
        return 'focus:bg-green-100';
      case 'cyan':
        return 'focus:bg-cyan-100';
      case 'indigo':
        return 'focus:bg-indigo-100';
    }
  }

  return (
    <div className={`sticky rotate${data.angle} ${getDarkColor(data.color)} h-56 w-56 p-3 flex flex-col`} onMouseEnter={() => setShowColorPicker(true)} onMouseLeave={() => setShowColorPicker(false)}>
      <textarea
        value={data.text}
        spellCheck={false}
        placeholder="Enter text..."
        onChange={onChange}
        className={`stickyText textarea w-full bg-transparent text-gray-700 nodrag ${getFocusLightColor(data.color)} focus:outline-none rounded h-full`}
      />
      {showColorPicker && (
        <div className='flex bg-transparent h-2 mt-1 justify-end nodrag'>
          <button className='bg-red-400 h-2 w-4 ml-1' onClick={() => changeColor('red')}></button>
          <button className='bg-orange-400 h-2 w-4 ml-1' onClick={() => changeColor('orange')}></button>
          <button className='bg-yellow-400 h-2 w-4 ml-1' onClick={() => changeColor('yellow')}></button>
          <button className='bg-green-400 h-2 w-4 ml-1' onClick={() => changeColor('green')}></button>
          <button className='bg-cyan-400 h-2 w-4 ml-1' onClick={() => changeColor('cyan')}></button>
          <button className='bg-indigo-400 h-2 w-4 ml-1' onClick={() => changeColor('indigo')}></button>
        </div>
      )}
    </div>
  )
}

export default StickyNode