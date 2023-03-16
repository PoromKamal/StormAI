import { useCallback } from 'react'
import { nodesMap } from '../../hooks/useNodesStateSynced';

const StickyNode = ({ id, data }) => {

  const onChange = useCallback((e) => {
    const currentNode = nodesMap.get(id);
    nodesMap.set(id, {
      ...currentNode,
      data: { label: e.target.value },
    });
  }, [])

  return (
    <div className='bg-gray-200 h-48 w-48 p-3 border rounded flex'>
      <textarea
        value={data.label}
        spellCheck={false}
        placeholder="Enter text..."
        onChange={onChange}
        className="textarea w-full bg-transparent text-black nodrag focus:bg-gray-100 focus:outline-none rounded"
      />
    </div>
  )
}

export default StickyNode