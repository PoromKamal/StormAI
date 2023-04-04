import { useCallback, useContext, useState, useEffect } from 'react'
import { YjsContext } from '../../../room/components/Room';
import { Handle, Position } from 'reactflow'

const MindMapNode = ({ id, data }) => {
  const [showHandles, setShowHandles] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { yDoc } = useContext(YjsContext);

  // Hide handles after 3s
  useEffect(() => {
    if (showHandles) {
      const timeout = setTimeout(() => {
        setShowHandles(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showHandles]);

  const onChange = useCallback((e) => {
    const currentNode = yDoc.getMap('nodes').get(id);
    yDoc.getMap('nodes').set(id, {
      ...currentNode,
      data: { ...currentNode.data, label: e.target.value },
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

  const getColor = (color) => {
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

  const getBorderColor = (color) => {
    switch (color) {
      case 'red':
        return 'border-red-400';
      case 'orange':
        return 'border-orange-400';
      case 'yellow':
        return 'border-yellow-400';
      case 'green':
        return 'border-green-400';
      case 'cyan':
        return 'border-cyan-400';
      case 'indigo':
        return 'border-indigo-400';
    }
  }

  return (
    <div>
      <div onClick={() => setShowHandles(true)} onMouseEnter={() => setShowColorPicker(true)} onMouseLeave={() => setShowColorPicker(false)} className={`${getColor(data.color)} h-36 p-3 border ${getBorderColor(data.color)} rounded-3xl flex flex-col`}>
        <textarea
          rows={100}
          cols={20}
          className='text-black text-lg nodrag resize-none bg-transparent w-full focus:outline-none rounded-2xl focus:placeholder-transparent text-center h-full'
          value={data.label}
          placeholder='Enter text...'
          onChange={onChange}
          spellCheck={false} />
        {showColorPicker && (
          <div className='flex bg-transparent h-2 mt-1 justify-center nodrag'>
            <button className='bg-red-400 h-2 w-4 ml-1' onClick={() => changeColor('red')}></button>
            <button className='bg-orange-400 h-2 w-4 ml-1' onClick={() => changeColor('orange')}></button>
            <button className='bg-yellow-400 h-2 w-4 ml-1' onClick={() => changeColor('yellow')}></button>
            <button className='bg-green-400 h-2 w-4 ml-1' onClick={() => changeColor('green')}></button>
            <button className='bg-cyan-400 h-2 w-4 ml-1' onClick={() => changeColor('cyan')}></button>
            <button className='bg-indigo-400 h-2 w-4 ml-1' onClick={() => changeColor('indigo')}></button>
          </div>
        )}
      </div>
      {showHandles && (
        <>
          <Handle type="target" id="t-top" position={Position.Top} />
          <Handle type="source" id="s-top" position={Position.Top} />
          <Handle type="target" id="t-bottom" position={Position.Bottom} />
          <Handle type="source" id="s-bottom" position={Position.Bottom} />
          <Handle type="target" id="t-left" position={Position.Left} />
          <Handle type="source" id="s-left" position={Position.Left} />
          <Handle type="target" id="t-right" position={Position.Right} />
          <Handle type="source" id="s-right" position={Position.Right} />
        </>
      )}
    </div>
  )
}

export default MindMapNode