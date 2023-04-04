import { Doc, encodeStateAsUpdate } from 'yjs';
import { useReactFlow } from 'reactflow';

const useFlowboardUtils = () => {
  const { project } = useReactFlow();

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

  const computeRandom = (min, max) => {
    // compute random integer (can be negative or positive) between min and max
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const mapSourceToTargetHandle = (handle) => {
    switch (handle) {
      case 's-top':
        return 't-bottom';
      case 's-bottom':
        return 't-top';
      case 's-left':
        return 't-right';
      case 's-right':
        return 't-left';
      default:
        return 't-top';
    }
  }

  const createNewNode = (type, { x, y }, data) => {
    switch (type) {
      case 'cursor':
        return createNewCursorNode(x, y, data);
      case 'sticky':
        return createNewStickyNode(x, y);
      case 'mindmap':
        return createNewMindmapNode(x, y);
      case 'canvas':
        return createNewCanvasNode(x, y);
      case 'story':
        return createNewStoryNode(x, y);
      case 'artist':
        return createNewArtistNode(x, y);
      case 'chat':
        return createNewChatNode(x, y);
      default:
        return null;
    }
  }

  const createNewCursorNode = (x, y, data) => {
    return {
      id: `${data.user.name}-cursor`,
      type: 'cursor',
      position: project({ x, y }),
      data: { label: `${data.user.name}`, cursor: { name: data.user.name, color: data.user.color } },
      zIndex: 1000,
    };
  }

  const createNewStickyNode = (x, y) => {
    return {
      id: createNodeId(),
      type: 'sticky',
      position: project({ x: x - 112, y: y - 112 }),
      data: { text: '', color: 'yellow', angle: computeRandom(-6, 6) },
    };
  }

  const createNewMindmapNode = (x, y) => {
    return {
      id: createNodeId(),
      type: 'mindmap',
      position: project({ x: x - 132, y: y - 32 }),
      data: { label: '', color: 'green' },
    };
  }

  const createNewCanvasNode = (x, y) => {
    return {
      id: createNodeId(),
      type: 'canvas',
      position: project({ x: x - 200, y: y - 200 }),
      data: { paths: [] },
    };
  }

  const createNewStoryNode = (x, y) => {
    return {
      id: createNodeId(),
      type: 'story',
      position: project({ x: x - 144, y: y - 144 }),
      data: { text: 'Start a story...' },
    };
  }

  const createNewArtistNode = (x, y) => {
    return {
      id: createNodeId(),
      type: 'artist',
      position: project({ x: x - 144, y: y - 56 }),
      data: { text: 'What to draw...' },
    };
  }

  const createNewChatNode = (x, y) => {
    return {
      id: createNodeId(),
      type: 'chat',
      position: project({ x: x - 144, y: y - 144 }),
      data: { text: '', answer:'' },
    };
  }

  return [prepareDocForSaving, mapSourceToTargetHandle, createNewNode];
}

export default useFlowboardUtils