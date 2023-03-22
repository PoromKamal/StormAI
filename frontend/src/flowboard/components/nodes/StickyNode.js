import { useCallback, useContext } from 'react'
import { YjsContext } from '../../../room/components/Room';

const StickyNode = ({ id, data }) => {
  const { yDoc } = useContext(YjsContext);

  const onChange = useCallback((e) => {
    const currentNode = yDoc.getMap('nodes').get(id);
    yDoc.getMap('nodes').set(id, {
      ...currentNode,
      data: { label: e.target.value },
    });
  }, [])

  return (
    <div className='bg-gray-200 h-48 w-48 p-3 border rounded flex' style={{
      transition: "transform 1s linear",
    }}>
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