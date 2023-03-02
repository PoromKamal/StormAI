import './App.css';
import WhiteBoard from './WhiteBoard';
import { WhiteBoardProvider } from './WhiteBoardContext';
import React, { useState } from 'react';
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
        <WhiteBoardProvider>
          <WhiteBoard backgroundColor={backgroundColor} />
        </WhiteBoardProvider>
        <Connected />
      </SocketContext.Provider>
    </>
  );
}

export default App;
