import './App.css';
import Room from './room/components/Room';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProFeatures from './room/components/ProFeatures';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Room />} />
        <Route path="/invite/:roomId" element={<Room />} />
        <Route path="/ProFeatures"   element={<ProFeatures />}/>
      </Routes>
    </Router>
  );
}

export default App;
