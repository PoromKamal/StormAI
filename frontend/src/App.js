import './App.css';
import WhiteBoard from './WhiteBoard';
import { WhiteBoardProvider } from './WhiteBoardContext';
import React, { Component }  from 'react';
function App() {
  return (
    <>
    <WhiteBoardProvider>
      <WhiteBoard />
    </WhiteBoardProvider>

    </>
  );
}

export default App;