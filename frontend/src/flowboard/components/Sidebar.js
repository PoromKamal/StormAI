import React from 'react';

const onDragStart = (event, nodeType) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const Sidebar = () => {
  return (
    <div className='absolute'>
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
    </div>
  );
};

export default Sidebar;