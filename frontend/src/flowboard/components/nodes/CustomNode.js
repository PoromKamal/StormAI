import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import cx from 'classnames';

const CustomNode = ({ data, sourcePosition, targetPosition }) => {
  const [isDropzoneActive, setIsDropzoneActive] = useState(false);

  const onDrop = () => {
    setIsDropzoneActive(false);
  }

  const onDragOver = (event) => {
    event.preventDefault();
  }

  const onDragEnter = () => {
    setIsDropzoneActive(true);
  }

  const onDragLeave = () => {
    setIsDropzoneActive(false);
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <Handle type="target" position={targetPosition || Position.Top} />
      <Handle type="source" position={sourcePosition || Position.Bottom} />
      {data.label}
    </div>
  )
}

export default CustomNode