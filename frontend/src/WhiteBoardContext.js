import React, { useContext, useRef, useState } from "react";
import SocketContext from './SocketContext';

const WhiteBoardContext = React.createContext();

export const WhiteBoardProvider = ({ children }) => {
  const socket = useContext(SocketContext);
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const prepareWhiteBoard = () => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d")
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "red";
    context.lineWidth = 5;
    contextRef.current = context;
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    socket.emit('down', offsetX, offsetY);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const drawHelper = (x, y) => {
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  }

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    drawHelper(offsetX, offsetY);
    socket.emit('draw', offsetX, offsetY);
  };

  return (
    <WhiteBoardContext.Provider
      value={{
        canvasRef,
        contextRef,
        prepareWhiteBoard,
        startDrawing,
        finishDrawing,
        draw,
        drawHelper
      }}
    >
      {children}
    </WhiteBoardContext.Provider>
  );
};

export const useWhiteBoard = () => useContext(WhiteBoardContext);

export default WhiteBoardContext;