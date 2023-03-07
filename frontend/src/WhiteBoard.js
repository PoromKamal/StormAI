import React, { useEffect, useState, useRef, useContext } from "react";
import { useWhiteBoard } from "./WhiteBoardContext";
import SocketContext from './SocketContext';
import Cursor from "./Cursor";

export function WhiteBoard() {
  const socket = useContext(SocketContext);
  const [backgroundColor, setBackground] = useState("white");
  const { canvasRef, contextRef, pathRef, prepareWhiteBoard, startDrawing, finishDrawing, draw, drawHelper, drawPath } =
    useWhiteBoard();
  const backgroundRef = useRef(null);

  useEffect(() => {
    socket.on('joinedRoom', (roomId, room) => {
      let paths = room.paths;
      paths.forEach((path) => {
        drawPath(path);
      });
    });

    socket.on('draw', (x, y) => {
      drawHelper(x, y);
    });

    socket.on('drawCursor', (id, x, y) => {
      let elementId = `cursor-${id}`;
      let cursor = document.getElementById(elementId);
      if (!cursor) {
        cursor = document.createElement('div');
        cursor.id = elementId;
        cursor.className = 'cursor';
        cursor.innerHTML = `
        <span className='absolute text-xs -right-1 w-3'>${id}</span>`;
        document.body.appendChild(cursor);
      }
      cursor.style.left = x + 'px';
      cursor.style.top = y + 'px';
    });

    socket.on('onDown', (x, y) => {
      //contextRef.current.beginPath();
      //contextRef.current.moveTo(x, y);
      pathRef.current = new Path2D();
      pathRef.current.moveTo(x, y);
    });
  }, []);

  useEffect(() => {
    prepareWhiteBoard();
    document.getElementById("canvas").addEventListener("mousemove", (e) => {
      socket.emit("drawCursor", socket.id, e.clientX, e.clientY);
    });
  }, []);


  useEffect(() => {
    if (backgroundRef.current) {
      prepareBackground();
    }
  }, [backgroundRef.current]);


  const handleBackgroundColorChange = () => {
    if (backgroundColor === "white") {
      setBackground("red");
    } else {
      setBackground("white");
    }
  };


  const prepareBackground = () => {
    const backgroundCanvas = canvasRef.current;
    //console.log(backgroundCanvas);
    if (backgroundCanvas) {


      const backgroundContext = backgroundCanvas.getContext("2d");
      backgroundContext.beginPath();
      backgroundContext.strokeStyle = "#ccc";
      backgroundContext.lineWidth = 1;

      for (let x = 0; x < backgroundCanvas.width; x += 50) {
        backgroundContext.moveTo(x, 0);
        backgroundContext.lineTo(x, backgroundCanvas.height);
      }

      for (let y = 0; y < backgroundCanvas.height; y += 50) {
        backgroundContext.moveTo(0, y);
        backgroundContext.lineTo(backgroundCanvas.width, y);
      }
      backgroundContext.strokeStyle = "black";
      backgroundContext.stroke();
    }
  };

  const removeBackground = () => {
    const backgroundCanvas = canvasRef.current;
    if (backgroundCanvas) {
      const backgroundContext = backgroundCanvas.getContext("2d");
      backgroundContext.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    }
  }

  return (
    <div style={{ backgroundColor }}>
      <canvas
        id="canvas"
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
      <button onClick={handleBackgroundColorChange}>Change Color</button>
      <button onClick={prepareBackground}>Add Grid</button>
      <button onClick={removeBackground}>Remove Grid</button>
      <canvas ref={backgroundRef} className="canvas-background"></canvas>

    </div>
  );
}

export default WhiteBoard;
