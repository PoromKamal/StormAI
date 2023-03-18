import { useCallback, useEffect, useState, useContext } from 'react';
import { applyNodeChanges, getConnectedEdges } from 'reactflow';
import { YjsContext } from '../../room/components/Room';

const isNodeAddChange = (change) => change.type === 'add';
const isNodeResetChange = (change) => change.type === 'reset';

const useNodesStateSynced = () => {
  const [nodes, setNodes] = useState([]);
  const { yDoc } = useContext(YjsContext);

  const onNodesChange = useCallback((changes) => {
    const nodes = Array.from(yDoc.getMap('nodes').values()).filter((n) => n);

    const nextNodes = applyNodeChanges(changes, nodes);
    changes.forEach((change) => {
      if (!isNodeAddChange(change) && !isNodeResetChange(change)) {
        const node = nextNodes.find((n) => n.id === change.id);

        if (node && change.type !== 'remove') {
          yDoc.getMap('nodes').set(change.id, node);
        } else if (change.type === 'remove') {
          const deletedNode = yDoc.getMap('nodes').get(change.id);
          yDoc.getMap('nodes').delete(change.id);
          // when a node is removed, we also need to remove the connected edges
          const edges = Array.from(yDoc.getMap('edges').values()).map((e) => e);
          const connectedEdges = getConnectedEdges(deletedNode ? [deletedNode] : [], edges);
          connectedEdges.forEach((edge) => yDoc.getMap('edges').delete(edge.id));
        }
      }
    });
  }, []);

  useEffect(() => {
    const observer = () => {
      setNodes(Array.from(yDoc.getMap('nodes').values()));
    };

    setNodes(Array.from(yDoc.getMap('nodes').values()));
    yDoc.getMap('nodes').observe(observer);

    return () => yDoc.getMap('nodes').unobserve(observer);
  }, [setNodes]);

  return [nodes.filter((n) => n), onNodesChange];
}

export default useNodesStateSynced;