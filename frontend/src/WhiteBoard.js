import React, { useEffect } from "react";
import {useWhiteBoard}  from "./WhiteBoardContext";
import WhiteBoardContext from './WhiteBoardContext'


export function WhiteBoard() {

  const {
    canvasRef,
    prepareWhiteBoard,
    startDrawing,
    finishDrawing,
    draw,
  } = useWhiteBoard();
     

  useEffect(() => {
    prepareWhiteBoard();
  }, []);

  return (
    <canvas
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      ref={canvasRef}
    />
  );
}

export default WhiteBoard;