import './App.css';
import WhiteBoard from './WhiteBoard';
import { WhiteBoardProvider } from './WhiteBoardContext';
import Flowboard from './flowboard/components/Flowboard';
import { ReactFlowProvider } from 'reactflow';
import React, { useEffect, useState } from 'react';
import Connected from './Connected';
import SocketContext from './SocketContext';
import io from 'socket.io-client';

export const socket = io('http://localhost:5000');

function App() {
  const [backgroundColor, setBackgroundColor] = useState('white');

  const handleBackgroundColorChange = () => {
    setBackgroundColor('lightblue');
  };

  return (
    <>
      <SocketContext.Provider value={socket}>
        <ReactFlowProvider>
          <Flowboard />
        </ReactFlowProvider>
        <Connected />
      </SocketContext.Provider>
    </>
  );
}

export default App;
