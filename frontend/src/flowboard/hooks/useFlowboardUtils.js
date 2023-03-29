import { Doc, encodeStateAsUpdate } from 'yjs';

const usefFlowboardUtils = () => {

  const prepareDocForSaving = (yDoc) => {
    const lastUpdate = yDoc.getMap('roomInfo').get('lastUpdate');
    const time = new Date().getTime();
    if (!lastUpdate || time - lastUpdate > 10000) {
      console.log('Saving doc...');
      const roomId = yDoc.getMap('roomInfo').get('info')._id;
      yDoc.getMap('roomInfo').set('lastUpdate', time);

      const newDoc = new Doc();
      yDoc.getMap('nodes').forEach((node, key) => {
        newDoc.getMap('nodes').set(key, node);
      });
      // remove cursor nodes from newDoc
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
  }

  return [ prepareDocForSaving ];
}

export default useFlowboardUtils