import React, { useContext, useRef, useState } from "react";
import SocketContext from './SocketContext';

const WhiteBoardContext = React.createContext();

export const WhiteBoardProvider = ({ children }) => {
  const socket = useContext(SocketContext);
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const pathRef = useRef(null);

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

    pathRef.current = new Path2D();
    pathRef.coords = [];
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    //contextRef.current.beginPath();
    //contextRef.current.moveTo(offsetX, offsetY);
    pathRef.current = new Path2D();
    pathRef.coords = [];
    setIsDrawing(true);
    socket.emit('down', offsetX, offsetY);
  };

  const finishDrawing = () => {
    //contextRef.current.closePath();
    socket.emit('savePath', pathRef.coords);
    pathRef.current.closePath();
    setIsDrawing(false);
  };

  const drawPath = (path) => {
    contextRef.current.beginPath();
    contextRef.current.moveTo(path[0].x, path[0].y);
    path.forEach((point) => {
      contextRef.current.lineTo(point.x, point.y);
    });
    contextRef.current.stroke();
  }

  const drawHelper = (x, y) => {
    //contextRef.current.lineTo(x, y);
    pathRef.current.lineTo(x, y);
    pathRef.coords.push({ x, y });
    contextRef.current.stroke(pathRef.current);
    //contextRef.current.stroke();
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
        pathRef,
        prepareWhiteBoard,
        startDrawing,
        finishDrawing,
        draw,
        drawHelper,
        drawPath
      }}
    >
      {children}
    </WhiteBoardContext.Provider>
  );
};

export const useWhiteBoard = () => useContext(WhiteBoardContext);

export default WhiteBoardContext;