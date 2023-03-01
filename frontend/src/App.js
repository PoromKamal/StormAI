import './App.css';
import WhiteBoard from './WhiteBoard';
import { WhiteBoardProvider } from './WhiteBoardContext';
import React, { useState } from 'react';

function App() {
  const [backgroundColor, setBackgroundColor] = useState('white');

  const handleBackgroundColorChange = () => {
    setBackgroundColor('lightblue');
  };

  return (
    <>

      <WhiteBoardProvider>
        <WhiteBoard backgroundColor={backgroundColor} />
      </WhiteBoardProvider>
    </>
  );
}

export default App;
