import React, { useRef, useCallback } from 'react';
import ReactFlow, { MarkerType, Background, Controls, useReactFlow } from 'reactflow';
import CanvasNode from './nodes/CanvasNode';
import StickyNode from './nodes/StickyNode';
import CustomNode from './nodes/CustomNode';
import Sidebar from './Sidebar';
import useNodesStateSynced, { nodesMap } from '../hooks/useNodesStateSynced';
import useEdgesStateSynced, { edgesMap } from '../hooks/useEdgesStateSynced';
import useAutoLayout from '../hooks/useAutoLayout';

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
  const { project } = useReactFlow();

  const onNodeClick = useCallback((_, node) => {
    const currentNode = nodesMap.get(node.id);
    console.log(currentNode);
    if (currentNode) {
      nodesMap.set(node.id, {
        ...currentNode,
        className: undefined,
      });
    }
    window.setTimeout(() => {
      const currentNode = nodesMap.get(node.id);
      if (currentNode) {
        nodesMap.set(node.id, {
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
      const position = project({ x: event.clientX - wrapperBounds.x - 80, y: event.clientY - wrapperBounds.top - 20 });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };

      nodesMap.set(newNode.id, newNode);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.rfWrapper} ref={wrapperRef}>
        <ReactFlow
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
          <Background color="#99b3ec" variant='dots'/>
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default Flowboard