import { useCallback, useContext } from 'react'
import { YjsContext } from '../../../room/components/Room';
import '../../styles/nodes.css';

const StickyNode = ({ id, data }) => {
  const { yDoc } = useContext(YjsContext);

  const onChange = useCallback((e) => {
    const currentNode = yDoc.getMap('nodes').get(id);
    yDoc.getMap('nodes').set(id, {
      ...currentNode,
      data: { text: e.target.value },
    });
  }, [])

  return (
    <div className={`sticky rotate${data.angle} bg-yellow-200 h-56 w-56 p-3 flex`}>
      <textarea
        value={data.text}
        spellCheck={false}
        placeholder="Enter text..."
        onChange={onChange}
        className="stickyText textarea w-full bg-transparent text-gray-700 nodrag focus:bg-yellow-100 focus:outline-none rounded"
      />
    </div>
  )
}

export default StickyNode