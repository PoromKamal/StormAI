import React from 'react';
import { useState, createContext, useEffect } from 'react'; 
import PayButton from './PayButton';
import './ProFeatures.css';
import apiService from '../../services/apiService';
import StormLogo from './StormLogo';
import { useNavigate } from 'react-router-dom';

const SavedWhiteboards = () => {
  const [user, setUser] = useState({ authenticated: false });
  const [whiteboards, setWhiteboards] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    apiService.getMe().then((response) => {
      let user = {};
      if (response.error != null){
          user = {"authenticated": false};
      }else{
          user = {"authenticated": true, "username": response.username};
      }
      setUser(user);
    });

    apiService.getWhiteboards().then((response) => {
        setWhiteboards(response);
    });
  }, []);

  const handleLaunchBoard = (whiteboardId) => {
    navigate("/")
  }

  const whiteboardItem = (whiteboard) => {
    return (
      <div className='flex gap-5 items-center justify-center w-full '>
        <a className="bg-gray-200 hover:bg-gray-400 hover:scale-105 p-10 rounded-xl w-1/2 cursor-pointer"
            href={`/launch/${whiteboard.whiteboardId}`}>
            <div className="text-xl ">
            {whiteboard.roomName}
            </div>
        </a>
      </div>
    );
  };

  return (
    <div className='flex flex-col items-center w-full h-full gap-5 overflow-scroll'>
        <StormLogo />

        <div className='mt-14 flex flex-col gap-10 w-full items-center'>
            <div className='text-3xl font-extrabold mb-10 text-storm-blue'>
                Your saved whiteboards
            </div>
            {
            
                whiteboards.map((whiteboard) => { return whiteboardItem(whiteboard)})
            }
        </div>
    </div>
  );
};

export default SavedWhiteboards;
