import { useCallback, useContext, useState, useEffect } from 'react'
import { YjsContext } from '../../../room/components/Room';
import { Handle, Position } from 'reactflow'

const MindMapNode = ({ id, data }) => {
  const [showHandles, setShowHandles] = useState(true);
  const [dragging, setDragging] = useState(false);
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
      data: { label: e.target.value },
    });
  }, [])

  const toggleHandles = useCallback(() => {
    setShowHandles(!showHandles);
  }, [showHandles])

  return (
    <div>
      <div onClick={toggleHandles} className='inputWrapper bg-gray-200 h-24 p-3 border rounded flex'>
        <input className='text-black nodrag' value={data.label} onChange={onChange} spellCheck={false} />
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