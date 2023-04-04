import React, { useRef, useCallback, useContext, useEffect } from 'react';
import ReactFlow, { MarkerType, Background, Controls, useReactFlow, useStoreApi, MiniMap } from 'reactflow';
import CanvasNode from './nodes/CanvasNode';
import StickyNode from './nodes/StickyNode';
import CursorNode from './nodes/CursorNode';
import StoryNode from './nodes/StoryNode';
import ArtistNode from './nodes/ArtistNode';
import MindMapNode from './nodes/MindMapNode';
import ChatNode from './nodes/ChatNode';
import MindMapEdge from './edges/MindMapEdge';
import Sidebar from './Sidebar';
import useNodesStateSynced from '../hooks/useNodesStateSynced';
import useEdgesStateSynced from '../hooks/useEdgesStateSynced';
import useFlowboardUtils from '../hooks/useFlowboardUtils';
import { YjsContext } from '../../room/components/Room';
import roomService from '../../room/services/RoomService';
import { throttle } from 'lodash';
import 'reactflow/dist/style.css';
import styles from '../styles/style.module.css';

const nodeTypes = {
  canvas: CanvasNode,
  sticky: StickyNode,
  cursor: CursorNode,
  story: StoryNode,
  artist: ArtistNode,
  mindmap: MindMapNode,
  chat: ChatNode,
};

const edgeTypes = {
  mindmap: MindMapEdge,
};

const nodeColor = (node) => {
  switch (node.type) {
    case 'sticky':
      return 'rgb(254 240 138)';
    case 'cursor':
      return '#76ff03';
    case 'mindmap':
      return 'rgb(187 247 208)';
    default:
      return 'rgb(17 24 39)';
  }
};

const defaultEdgeOptions = {
  type: 'default',
  markerEnd: { type: MarkerType.ArrowClosed },
  pathOptions: { offset: 5 },
};

const Flowboard = () => {
  const wrapperRef = useRef(null);
  const [prepareDocForSaving, mapSourceToTargetHandle, createNewNode] = useFlowboardUtils();
  const [nodes, onNodesChange] = useNodesStateSynced();
  const [edges, onEdgesChange, onConnect] = useEdgesStateSynced();
  const { yDoc, yjsProvider } = useContext(YjsContext);
  const { project } = useReactFlow();
  const store = useStoreApi();
  const transform = useRef(store.getState().transform);
  const connectingNodeId = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Checking if doc needs to be saved...');
      if (yDoc) {
        const lastUpdate = yDoc.getMap('roomInfo').get('lastUpdate');
        const time = new Date().getTime();
        if (!lastUpdate || time - lastUpdate > 10000) {
          console.log('Saving doc...');
          const roomId = yDoc.getMap('roomInfo').get('info')._id;
          const docState = prepareDocForSaving(yDoc);
          roomService.updateDoc(roomId, docState, time);
        }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Required to get the current pan and zoom values
  useEffect(() => store.subscribe(
    state => (transform.current = state.transform)
  ), [])

  const onNodeClick = useCallback((_, node) => {
    // For debugging, can remove later
    console.log(node);
  }, []);

  // For dragging and dropping nodes
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  // For dragging and dropping nodes
  const onDrop = (event) => {
    event.preventDefault();

    if (wrapperRef.current) {
      const wrapperBounds = wrapperRef.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return
      };
      const xy = { x: event.clientX - wrapperBounds.left, y: event.clientY - wrapperBounds.top };
      const newNode = createNewNode(type, xy);
      if (newNode) {
        yDoc.getMap('nodes').set(newNode.id, newNode);
      }
    }
  };

  const onConnectStart = useCallback((event, { nodeId }) => {
    connectingNodeId.current = nodeId;
    connectingNodeId.handle = event.target.getAttribute('data-handleid');
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      const targetIsPane = event.target.classList.contains('react-flow__pane');
      if (targetIsPane) {
        const wrapperBounds = wrapperRef.current.getBoundingClientRect();
        const xy = project({ x: (event.clientX - wrapperBounds.left - transform.current[0]) / transform.current[2], y: (event.clientY - wrapperBounds.top - transform.current[1]) / transform.current[2] });
        const newNode = createNewNode('mindmap', xy);
        if (newNode) {
          yDoc.getMap('nodes').set(newNode.id, newNode);
          onConnect({
            source: connectingNodeId.current,
            sourceHandle: connectingNodeId.handle,
            target: newNode.id,
            targetHandle: mapSourceToTargetHandle(connectingNodeId.handle)
          });
        }
      }
    }, []);

  const sendCursorData = (event) => {
    event.preventDefault();
    const wrapperBounds = wrapperRef.current.getBoundingClientRect();
    // Compute the position of the cursor relative to the pan and zoom values
    const position = project({ x: (event.clientX - wrapperBounds.left - transform.current[0]) / transform.current[2], y: (event.clientY - wrapperBounds.top - transform.current[1]) / transform.current[2] });
    const user = yjsProvider.awareness.getLocalState().user;
    const cursorNode = yDoc.getMap('nodes').get(`${user.name}-cursor`);
    if (cursorNode) {
      yDoc.getMap('nodes').set(`${user.name}-cursor`, {
        ...cursorNode,
        position,
      });
    } else {
      const newNode = createNewNode('cursor', position, { user });
      yDoc.getMap('nodes').set(newNode.id, newNode);
    }
  }

  // Throttle the cursor data to 20ms
  const throttledSendCursorData = useCallback(throttle(sendCursorData, 20), []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.rfWrapper} ref={wrapperRef}>
        <ReactFlow
          onPaneMouseMove={throttledSendCursorData}
          nodes={nodes.filter(node => node.id !== `${yjsProvider.awareness.getLocalState().user.name}-cursor`)}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onDrop={onDrop}
          onDragOver={onDragOver}
          defaultEdgeOptions={defaultEdgeOptions}
        >
          <Background color="#99b3ec" variant={yDoc.getMap('settings').get('variant')} />
          <Controls className='bg-white rounded' />
          <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
}

export default Flowboard