import React, { useRef, useCallback, useContext } from 'react';
import ReactFlow, { MarkerType, Background, Controls, useReactFlow, useStore } from 'reactflow';
import CanvasNode from './nodes/CanvasNode';
import StickyNode from './nodes/StickyNode';
import CustomNode from './nodes/CustomNode';
import Sidebar from './Sidebar';
import useNodesStateSynced from '../hooks/useNodesStateSynced';
import useEdgesStateSynced from '../hooks/useEdgesStateSynced';
import { YjsContext } from '../../room/components/Room';

import 'reactflow/dist/style.css';
import styles from '../styles/style.module.css';

const nodeTypes = {
  canvas: CanvasNode,
  sticky: StickyNode,
  custom: CustomNode,
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

  const onNodeClick = useCallback((_, node) => {
    const currentNode = yDoc.getMap('nodes').get(node.id);
    console.log(currentNode);
    if (currentNode) {
      yDoc.getMap('nodes').set(node.id, {
        ...currentNode,
        className: undefined,
      });
    }
    window.setTimeout(() => {
      const currentNode = yDoc.getMap('nodes').get(node.id);
      if (currentNode) {
        yDoc.getMap('nodes').set(node.id, {
          ...currentNode,
          className: undefined,
        });
      }
    }, 3000);
  }, []);

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
        data: { label: `${type}` },
      };
      console.log(newNode);
      yDoc.getMap('nodes').set(newNode.id, newNode);
    }
  };

  const sendCursorData = (event) => {
    const wrapperBounds = wrapperRef.current.getBoundingClientRect();
    const position = project({ x: event.clientX - wrapperBounds.left, y: event.clientY - wrapperBounds.top });
    const user = yjsProvider.awareness.getLocalState().user;
    //console.log(user);
    yjsProvider.awareness.setLocalStateField('user', {
      ...user,
      cursor: position,
    });
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.rfWrapper} ref={wrapperRef}>
        <ReactFlow
          onMouseMove={sendCursorData}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          defaultEdgeOptions={defaultEdgeOptions}
        >
          <Background color="#99b3ec" variant='lines' />
          <Controls />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
}

export default Flowboard