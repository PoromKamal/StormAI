import './App.css';
import Room from './room/components/Room';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Room />} />
        <Route path="/invite/:roomId" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
