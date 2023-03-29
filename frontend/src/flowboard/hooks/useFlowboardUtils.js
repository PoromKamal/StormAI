import { Doc, encodeStateAsUpdate } from 'yjs';

const useFlowboardUtils = () => {

  const prepareDocForSaving = (yDoc) => {
    const time = new Date().getTime();
    yDoc.getMap('roomInfo').set('lastUpdate', time);

    const newDoc = new Doc();
    // Copy nodes and edges from yDoc to newDoc
    yDoc.getMap('nodes').forEach((node, key) => {
      newDoc.getMap('nodes').set(key, node);
    });
    // Remove cursor nodes from newDoc
    newDoc.getMap('nodes').forEach((node, key) => {
      if (node.type === 'cursor') {
        newDoc.getMap('nodes').delete(key);
      }
    });
    yDoc.getMap('edges').forEach((edge, key) => {
      newDoc.getMap('edges').set(key, edge);
    });
    yDoc.getMap('settings').forEach((setting, key) => {
      newDoc.getMap('settings').set(key, setting);
    });
    return encodeStateAsUpdate(newDoc);
  }

  const createNodeId = () => {
    return `dndnode_${Math.random() * 10000}`
  };


  return [prepareDocForSaving, createNodeId];
}

export default useFlowboardUtils