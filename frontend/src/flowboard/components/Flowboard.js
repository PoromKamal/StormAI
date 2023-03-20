import React, { useRef, useCallback, useContext, useState, useEffect } from 'react';
import ReactFlow, { MarkerType, Background, Controls, useReactFlow, useStoreApi, useStore, MiniMap } from 'reactflow';
import CanvasNode from './nodes/CanvasNode';
import StickyNode from './nodes/StickyNode';
import CursorNode from './nodes/CursorNode';
import Cursor from '../../cursors/components/Cursor';
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
};

const edgeTypes = {

};

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed },
  pathOptions: { offset: 5 },
};

const getId = () => `dndnode_${Math.random() * 10000}`;

const onDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

const Flowboard = () => {
  const wrapperRef = useRef(null);
  const [nodes, onNodesChange] = useNodesStateSynced();
  const [edges, onEdgesChange, onConnect] = useEdgesStateSynced();
  const { yDoc, yjsProvider } = useContext(YjsContext);
  const { project } = useReactFlow();
  const [awareness] = useState(yjsProvider.awareness);
  const [cursors, setCursors] = useState([]);
  const store = useStoreApi();
  const transform = useRef(store.getState().transform);

  useEffect(() => store.subscribe(
    state => (transform.current = state.transform)
  ), [])

  // useEffect(() => {
  //   const handler = () => {
  //     const newCursors = [];
  //     awareness.getStates().forEach(state => {
  //       if (state.user) {
  //         newCursors.push(state.user);
  //       }
  //     })
  //     setCursors(newCursors);
  //   }
  //   awareness.on('change', handler);
  // }, [awareness]);

  // const onNodeClick = useCallback((_, node) => {
  //   const currentNode = yDoc.getMap('nodes').get(node.id);
  //   console.log(currentNode);
  //   if (currentNode) {
  //     yDoc.getMap('nodes').set(node.id, {
  //       ...currentNode,
  //       position: { x: currentNode.position.x , y: currentNode.position.y },
  //       className: undefined,
  //     });
  //   }
  //   window.setTimeout(() => {
  //     const currentNode = yDoc.getMap('nodes').get(node.id);
  //     if (currentNode) {
  //       yDoc.getMap('nodes').set(node.id, {
  //         ...currentNode,
  //         className: undefined,
  //       });
  //     }
  //   }, 3000);
  // }, []);

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
        data: { label: `${type}`, cursor: {name: 'test', color: '#1be7ff'} },
      };
      console.log(newNode);
      yDoc.getMap('nodes').set(newNode.id, newNode);
    }
  };

  const sendCursorData = (event) => {
    const wrapperBounds = wrapperRef.current.getBoundingClientRect();
    const position = project({ x: event.clientX - wrapperBounds.left, y: event.clientY - wrapperBounds.top });
    const user = yjsProvider.awareness.getLocalState().user;
    // yjsProvider.awareness.setLocalStateField('user', {
    //   ...user,
    //   cursor: position,
    // });
    const cursorNode = yDoc.getMap('nodes').get(`${user.name}-cursor`);
    if (cursorNode) {
      console.log('here1');
      yDoc.getMap('nodes').set(`${user.name}-cursor`, {
        ...cursorNode,
        position,
      });
    } else {
      console.log('here2')
      const newNode = {
        id: `${user.name}-cursor`,
        type: 'cursor',
        position,
        data: { label: `${user.name}`, cursor: {name: user.name, color: user.color} },
        zIndex: 1000,
      };
      yDoc.getMap('nodes').set(newNode.id, newNode);
    }

    // const wrapperBounds = wrapperRef.current.getBoundingClientRect();
    // const [x, y] = [event.clientX - wrapperBounds.left, event.clientY - wrapperBounds.top];

    // // Get the current zoom level and viewport of the React Flow canvas
    // const viewportX = transform.current[0];
    // const viewportY = transform.current[1];
    // const zoom = transform.current[2];

    // // Convert the absolute mouse position to the relative position within the canvas
    // const [canvasX, canvasY] = [(x - viewportX) / zoom, (y - viewportY) / zoom];
    // const user = yjsProvider.awareness.getLocalState().user;
    // yjsProvider.awareness.setLocalStateField('user', {
    //   ...user,
    //   cursor: { x: canvasX , y: canvasY },
    // });
  }

  const throttledSendCursorData = useCallback(throttle(sendCursorData, 20), []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.rfWrapper} ref={wrapperRef}>
        <ReactFlow
          onMouseMove={throttledSendCursorData}
          nodes={nodes.filter(node => node.id !== `${yjsProvider.awareness.getLocalState().user.name}-cursor`)}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          defaultEdgeOptions={defaultEdgeOptions}
        >
          <Background color="#99b3ec" variant='lines' />
          <Controls className='bg-white rounded' />
          {/* {cursors.filter(user => user.cursor).filter(user => user.name !== awareness.getLocalState().user.name).map((user, index) => (
            <Cursor key={index} user={user} />
          ))} */}
          <MiniMap />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
}

export default Flowboard