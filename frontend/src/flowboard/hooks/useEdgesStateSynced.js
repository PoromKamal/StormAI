import { useCallback, useEffect, useState, useContext } from 'react';
import { applyEdgeChanges } from 'reactflow';
import { YjsContext } from '../../room/components/Room';

const isEdgeAddChange = (change) => change.type === 'add';
const isEdgeResetChange = (change) => change.type === 'reset';
const isEdgeRemoveChange = (change) => change.type === 'remove';

const useEdgesStateSynced = () => {
  const [edges, setEdges] = useState([]);
  const { yDoc } = useContext(YjsContext);

  const onEdgesChange = useCallback((changes) => {
    const currentEdges = Array.from(yDoc.getMap('edges').values()).filter((e) => e);
    const nextEdges = applyEdgeChanges(changes, currentEdges);
    changes.forEach((change) => {
      if (isEdgeRemoveChange(change)) {
        yDoc.getMap('edges').delete(change.id);
      } else if (!isEdgeAddChange(change) && !isEdgeResetChange(change)) {
        yDoc.getMap('edges').set(change.id, nextEdges.find((e) => e.id === change.id));
      }
    });
  }, []);

  const onConnect = useCallback((params) => {
    const { source, sourceHandle, target, targetHandle } = params;
    const id = `edge-${source}${sourceHandle || ''}-${target}${targetHandle || ''}`;

    yDoc.getMap('edges').set(id, {
      id,
      ...params,
    });
  }, []);

  useEffect(() => {
    const observer = () => {
      setEdges(Array.from(yDoc.getMap('edges').values()));
    };

    setEdges(Array.from(yDoc.getMap('edges').values()));
    yDoc.getMap('edges').observe(observer);

    return () => yDoc.getMap('edges').unobserve(observer);
  }, [setEdges]);

  return [edges, onEdgesChange, onConnect];
}

export default useEdgesStateSynced;