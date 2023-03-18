import { useState, useLayoutEffect, useRef, useEffect, useContext } from 'react'
import { YjsContext } from '../../../room/components/Room';

const CanvasNode = ({ id, data }) => {
  const [drawing, setDrawing] = useState(false);
  const { yDoc } = useContext(YjsContext);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const pathRef = useRef(null);

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
    if (currentNode.data.points) {
      drawAllPoints(currentNode.data.points);
    }
  }, [data])

  const drawPoint = (x, y) => {
    contextRef.current.fillRect(x, y, 1, 1);
  }

  const drawAllPoints = (points) => {
    //contextRef.current.clearRect(0, 0, 400, 400)
    if (!points) return;
    points.forEach((point) => {
      drawPoint(point.x, point.y);
    })
  }

  const startDrawing = () => {
    pathRef.current = new Path2D();
    pathRef.coords = [];
    setDrawing(true);
  }

  const finishDrawing = () => {
    pathRef.current.closePath();
    setDrawing(false);
  }

  // const drawHelper = (x, y) => {
  //   pathRef.current.lineTo(x, y);
  //   pathRef.coords.push({ x, y });
  //   contextRef.current.stroke(pathRef.current);
  // }

  const draw = (e) => {
    if (!drawing) return;
    const currentNode = yDoc.getMap('nodes').get(id);
    const currentPoints = currentNode.data.points || [];
    const { x, y } = getMousePos(canvasRef.current, e);
    yDoc.getMap('nodes').set(id, {
      ...currentNode,
      data: { points: [...currentPoints, { x, y }] },
    });
    drawAllPoints(currentNode.data.points);
  }

  // const onDraw = useCallback((e) => {
  //   if (!drawing) return;
  //   const currentNode = yDoc.getMap('nodes').get(id);
  //   const currentPoints = currentNode.data.points || [];
  //   const { x, y } = getMousePos(canvasRef.current, e);
  //   yDoc.getMap('nodes').set(id, {
  //     ...currentNode,
  //     data: { points: [...currentPoints, { x, y }] },
  //   });
  //   drawAllPoints(currentNode.data.points);
  // }, [])

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
      y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
  }

  return (
    <div className=' bg-transparent border border-black rounded flex flex-col'
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}>
      <div className="dragHandle bg-black h-8">
        
      </div>
      <div>
        <canvas className='nodrag' width="400" height="400" ref={canvasRef}></canvas>
      </div>
    </div>
  )
}

export default CanvasNode