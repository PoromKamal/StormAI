import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  Panel,
  useStoreApi,
  useReactFlow,
  ConnectionLineType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CanvasNode from './CanvasNode';
import StickyNode from './StickyNode';
import MindMapNode from './MindMapNode';
import MindMapEdge from './MindMapEdge';
import Sidebar from './Sidebar';
//import useStore from './store';
import { shallow } from 'zustand/shallow';
import useNodesStateSynced, { nodesMap } from './hooks/useNodesStateSynced';
import useEdgesStateSynced from './hooks/useEdgesStateSynced';

const getId = () => `dndnode_${Math.random() * 10000}`;

const onDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
});

const nodeOrigin = [0.5, 0.5];
const connectionLineStyle = { stroke: '#87ceeb', strokeWidth: 2 };
const defaultEdgeOptions = { style: connectionLineStyle, type: 'mindmap' };

const nodeTypes = {
  canvas: CanvasNode,
  sticky: StickyNode,
  mindmap: MindMapNode,
};

const edgeTypes = {
  mindmap: MindMapEdge,
};

const Flowboard2 = () => {
  const [variant, setVariant] = useState('lines');
  const { nodes, edges, onNodesChange, onEdgesChange, addChildNode } = useStore(selector, shallow);
  const connectingNodeId = useRef(null);
  const store = useStoreApi();
  const { project } = useReactFlow();

  const getChildNodePosition = (event, parentNode) => {
    const { domNode } = store.getState();

    if (
      !domNode ||
      // we need to check if these properites exist, because when a node is not initialized yet,
      // it doesn't have a positionAbsolute nor a width or height
      !parentNode?.positionAbsolute ||
      !parentNode?.width ||
      !parentNode?.height
    ) {
      return;
    }
    const { top, left } = domNode.getBoundingClientRect();

    // we need to remove the wrapper bounds, in order to get the correct mouse position
    const panePosition = project({
      x: event.clientX - left,
      y: event.clientY - top,
    });

    // we are calculating with positionAbsolute here because child nodes are positioned relative to their parent
    return {
      x: panePosition.x - parentNode.positionAbsolute.x + parentNode.width / 2,
      y: panePosition.y - parentNode.positionAbsolute.y + parentNode.height / 2,
    };
  };

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback((event) => {
    const { nodeInternals } = store.getState();
    const targetIsPane = event.target.classList.contains('react-flow__pane');
    const node = event.target.closest('.react-flow__node');

    if (node) {
      node.querySelector('input')?.focus({ preventScroll: true });
    } else if (targetIsPane && connectingNodeId.current) {
      const parentNode = nodeInternals.get(connectingNodeId.current);
      const childNodePosition = getChildNodePosition(event, parentNode);

      if (parentNode && childNodePosition) {
        addChildNode(parentNode, childNodePosition);
      }
    }
  }, [getChildNodePosition]);

  return (
    <div className='h-full relative z-10'>
      <Sidebar/>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeOrigin={nodeOrigin}
        fitView={true}
        connectionLineStyle={connectionLineStyle}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.Straight}
      >
        <Background color="#99b3ec" variant={variant} />
        <Controls showInteractive={false} />
        <Panel position="top-left">
          <div>
            <span>Background:</span>
            <button className='underline ml-2' onClick={() => setVariant('dots')}>Dots</button>
            <button className='underline ml-2' onClick={() => setVariant('lines')}>Lines</button>
            <button className='underline ml-2' onClick={() => setVariant('cross')}>Cross</button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default Flowboard