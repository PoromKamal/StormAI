import React from 'react';

const onDragStart = (event, nodeType) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const Sidebar = () => {
  return (
    <aside className=''>
      <div
        className="react-flow__node-default"
        onDragStart={(event) => onDragStart(event, 'sticky')}
        draggable
      >
        Sticky Node
      </div>
      <div
        className="react-flow__node-default"
        onDragStart={(event) => onDragStart(event, 'canvas')}
        draggable
      >
        Canvas Node
      </div>
      <div
        className="react-flow__node-default"
        onDragStart={(event) => onDragStart(event, 'custom')}
        draggable
      >
        Custom Node
      </div>
    </aside>
  );
};

export default Sidebar;