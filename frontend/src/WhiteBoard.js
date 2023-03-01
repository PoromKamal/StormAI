import React, { useEffect, useState, useRef } from "react";
import { useWhiteBoard } from "./WhiteBoardContext";

export function WhiteBoard() {
  const [backgroundColor, setBackground] = useState("white");
  const { canvasRef, prepareWhiteBoard, startDrawing, finishDrawing, draw } =
    useWhiteBoard();
  const backgroundRef = useRef(null);

  useEffect(() => {
    prepareWhiteBoard();
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
    console.log(backgroundCanvas);
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
