import React, { useRef, useCallback, useContext, useEffect } from 'react';
import ReactFlow, { MarkerType, Background, Controls, useReactFlow, useStoreApi, MiniMap } from 'reactflow';
import CanvasNode from './nodes/CanvasNode';
import StickyNode from './nodes/StickyNode';
import CursorNode from './nodes/CursorNode';
import StoryNode from './nodes/StoryNode';
import Sidebar from './Sidebar';
import useNodesStateSynced from '../hooks/useNodesStateSynced';
import useEdgesStateSynced from '../hooks/useEdgesStateSynced';
import { YjsContext } from '../../room/components/Room';
import { throttle } from 'lodash';

import 'reactflow/dist/style.css';
import styles from '../styles/style.module.css';

const nodeTypes = {
  canvas: CanvasNode,
  sticky: StickyNode,
  cursor: CursorNode,
  story: StoryNode,
};

const edgeTypes = {
};

const nodeColor = (node) => {
  switch (node.type) {
    case 'sticky':
      return '#004d40';
    case 'cursor':
      return '#76ff03';
    default:
      return 'rgb(17 24 39)';
  }
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed },
  pathOptions: { offset: 5 },
};

const Flowboard = () => {
  const wrapperRef = useRef(null);
  const [nodes, onNodesChange] = useNodesStateSynced();
  const [edges, onEdgesChange, onConnect] = useEdgesStateSynced();
  const { yDoc, yjsProvider } = useContext(YjsContext);
  const { project } = useReactFlow();
  const store = useStoreApi();
  const transform = useRef(store.getState().transform);

  // Required to get the current pan and zoom values
  useEffect(() => store.subscribe(
    state => (transform.current = state.transform)
  ), [])

  const getId = () => `dndnode_${Math.random() * 10000}`;

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
      const position = project({ x: event.clientX - wrapperBounds.left - 80, y: event.clientY - wrapperBounds.top - 20 });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}`, paths: [] },
      };
      yDoc.getMap('nodes').set(newNode.id, newNode);
    }
  };

  const sendCursorData = (event) => {
    event.preventDefault();
    const wrapperBounds = wrapperRef.current.getBoundingClientRect();
    // Compute the position of the cursor relative to the pan and zoom values
    const position = project({ x: (event.clientX - wrapperBounds.left - transform.current[0]) / transform.current[2], y: (event.clientY - wrapperBounds.top - transform.current[1]) / transform.current[2]});
    const user = yjsProvider.awareness.getLocalState().user;
    const cursorNode = yDoc.getMap('nodes').get(`${user.name}-cursor`);
    if (cursorNode) {
      yDoc.getMap('nodes').set(`${user.name}-cursor`, {
        ...cursorNode,
        position,
      });
    } else {
      const newNode = {
        id: `${user.name}-cursor`,
        type: 'cursor',
        position,
        data: { label: `${user.name}`, cursor: { name: user.name, color: user.color } },
        zIndex: 1000,
      };
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