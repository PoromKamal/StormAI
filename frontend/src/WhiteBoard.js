import React, { useEffect, useState, useRef, useContext } from "react";
import { useWhiteBoard } from "./WhiteBoardContext";
import SocketContext from './SocketContext';
import Cursor from "./Cursor";

export function WhiteBoard() {
  const socket = useContext(SocketContext);
  const { canvasRef, pathRef, prepareWhiteBoard, startDrawing, finishDrawing, draw, drawHelper, drawPath } = useWhiteBoard();
  const backgroundRef = useRef(null);
  const [backgroundColor, setBackground] = useState("white");
  const [cursors, setCursors] = useState([]);

  useEffect(() => {
    socket.on('joinedRoom', (roomId, room) => {
      // Show previous drawings on the canvas
      let paths = room.paths;
      paths.forEach((path) => {
        drawPath(path);
      });
      // Emit getUsers in order to update the cursors
      socket.emit('getUsers', roomId);
    });

    socket.on('draw', (x, y) => {
      // Display other users' drawings
      drawHelper(x, y);
    });

    socket.on('drawCursor', (id, x, y) => {
      // Display other users' cursors
      setCursors((prev) => {
        return prev.map((cursor) => {
          if (cursor.userId === id) {
            return { ...cursor, x, y };
          }
          return cursor;
        });
      });
    });

    socket.on('onDown', (x, y) => {
      // Temporary fix for bug when user joins room and starts drawing
      // TODO: fix this properly (will probably have to change the way the path is drawn)
      pathRef.current = new Path2D();
      pathRef.current.moveTo(x, y);
    });
  }, []);

  useEffect(() => {
    // Updating cursors when a user joins or leaves the room
    const handler = (users) => {
      setCursors(users.filter((user) => user !== socket.id).map((user) => ({ userId: user, x: 0, y: 0 })));
    }

    socket.on("retrieveUsers", handler);

    return () => socket.off("retrieveUsers", handler);
  }, []);

  useEffect(() => {
    prepareWhiteBoard();
    document.getElementById("canvas").addEventListener("mousemove", (e) => {
      // TODO: throttle this event so we don't overload the server
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
      {cursors.map((cursor) => (
        <Cursor key={`cursor-${cursor.userId}`} cursor={cursor} />
      ))}
    </div>
  );
}

export default WhiteBoard;
