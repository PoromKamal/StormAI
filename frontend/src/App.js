import './App.css';
import Room from './room/components/Room';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProFeatures from './room/components/ProFeatures';
import SavedWhiteboards from './room/components/SavedWhiteboards';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Room />} />
        <Route path="/invite/:roomId" element={<Room />} />
        <Route path="/launch/:launchRoomId" element={<Room />} />
        <Route path="/ProFeatures"   element={<ProFeatures />}/>
        <Route path="/savedBoards" element={<SavedWhiteboards />} />
      </Routes>
    </Router>
  );
}

export default App;
