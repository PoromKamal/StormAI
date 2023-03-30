import { BaseEdge, getStraightPath } from 'reactflow';

const MindMapEdge = (props) => {
  const { sourceX, sourceY, targetX, targetY } = props;

  const [edgePath] = getStraightPath({
    sourceX,
    sourceY: sourceY - 48,
    targetX,
    targetY,
  });

  return <BaseEdge path={edgePath} {...props} />;
}

export default MindMapEdge