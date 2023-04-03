import { useState, useLayoutEffect, useRef, useEffect, useContext } from 'react'
import { YjsContext } from '../../../room/components/Room';

const CanvasNode = ({ id, data }) => {
  const [drawing, setDrawing] = useState(false);
  const [showOutline, setShowOutline] = useState(true);
  const [userInCanvas, setUserInCanvas] = useState(false);
  const { yDoc } = useContext(YjsContext);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const pathRef = useRef(null);

  // Hide outline 2s after the user leaves the node
  useEffect(() => {
    if (userInCanvas) {
      setShowOutline(true);
    } else {
      const timeout = setTimeout(() => {
        setShowOutline(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [userInCanvas]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    contextRef.current = ctx;

    pathRef.current = new Path2D();
    pathRef.coords = [];
  }, [])

  useEffect(() => {
    const currentNode = yDoc.getMap('nodes').get(id);
    if (currentNode.data.paths) {
      drawAllPaths(currentNode.data.paths);
    }
  }, [data])

  const drawPath = (path) => {
    contextRef.current.beginPath();
    contextRef.current.moveTo(path[0].x, path[0].y);
    path.forEach((point) => {
      contextRef.current.lineTo(point.x, point.y);
    });
    contextRef.current.stroke();
  }

  const drawAllPaths = (paths) => {
    paths.forEach((path) => {
      drawPath(path);
    })
  }

  const startDrawing = (e) => {
    pathRef.current = new Path2D();
    const { x, y } = getMousePos(canvasRef.current, e);
    pathRef.coords = [{ x, y }];
    setDrawing(true);
  }

  const finishDrawing = (e) => {
    pathRef.current.closePath();
    setDrawing(false);
    const currentNode = yDoc.getMap('nodes').get(id);
    yDoc.getMap('nodes').set(id, {
      ...currentNode,
      data: { paths: [...currentNode.data.paths, pathRef.coords] },
    });
  }

  const drawHelper = (x, y) => {
    pathRef.current.lineTo(x, y);
    pathRef.coords.push({ x, y });
    contextRef.current.stroke(pathRef.current);
  }

  const draw = (e) => {
    if (!drawing) return;
    const { x, y } = getMousePos(canvasRef.current, e);
    drawHelper(x, y);
  }

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
      y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
  }

  return (
    <div className={`bg-transparent rounded ${showOutline ? 'ring-1 ring-black border-t-8 border-black -mt-2' : ''}`}
      onClick={() => setShowOutline(true)}
      onMouseEnter={() => setUserInCanvas(true)}
      onMouseLeave={() => setUserInCanvas(false)}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw} tabIndex="0">
      <div>
        <canvas className='nodrag' width="400" height="400" ref={canvasRef}></canvas>
      </div>
    </div>
  )
}

export default CanvasNode