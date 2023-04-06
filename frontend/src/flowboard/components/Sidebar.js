import { useState, useContext } from 'react';
import { FaRegStickyNote, FaPen, FaCog, FaShareSquare, FaSitemap } from 'react-icons/fa';
import {AiFillSave} from 'react-icons/ai';
import apiService from '../../services/apiService';
import AiDropdownButton from './button/AiDropdownButton';
import Settings from './Settings';
import Invite from './Invite';
import { YjsContext } from '../../room/components/Room'

const onDragStart = (event, nodeType) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const Sidebar = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const { yDoc } = useContext(YjsContext);

  const toggleSettings = () => {
    if (inviteOpen) toggleInvite();
    setSettingsOpen(!settingsOpen);
  };

  const toggleInvite = () => {
    if (settingsOpen) toggleSettings();
    setInviteOpen(!inviteOpen);
  };

  const saveWhiteboard = () =>{
    let roomId = yDoc.getMap('roomInfo').get('info')._id;
    let roomName = yDoc.getMap('roomInfo').get('info').name;
    apiService.saveWhiteboard(roomId, roomName).then((response) => {
      if(response.status == 200)
        alert("Whiteboard has been saved to your collection!")
      else
        alert("Error saving whiteboard!")
    });
  }

  return (
    <>
      <div className='absolute top-1/2 -translate-y-1/2 border-none ml-4 h-96 bg-transparent flex flex-col items-center justify-center'>
        <AiDropdownButton />
        <div
          className="w-10 h-10 bg-gray-900 text-white border-none rounded shadow-md flex justify-center items-center text-xl my-1 hover:bg-gray-700 hover:scale-110 transition-transform"
          onDragStart={(event) => onDragStart(event, 'sticky')}
          draggable
        >
          <FaRegStickyNote />
        </div>
        <div
          className="w-10 h-10 bg-gray-900 text-white border-none rounded shadow-md flex justify-center items-center text-xl my-1 hover:bg-gray-700 hover:scale-110 transition-transform"
          onDragStart={(event) => onDragStart(event, 'mindmap')}
          draggable
        >
          <FaSitemap />
        </div>
        <div
          className="w-10 h-10 bg-gray-900 text-white border-none rounded shadow-md flex justify-center items-center text-xl my-1 hover:bg-gray-700 hover:scale-110 transition-transform"
          onDragStart={(event) => onDragStart(event, 'canvas')}
          draggable
        >
          <FaPen />
        </div>
        <div
          className="w-10 h-10 bg-gray-900 text-white border-none rounded shadow-md flex justify-center items-center text-xl my-1 hover:bg-gray-700 hover:scale-110 transition-transform hover: cursor-pointer"
          onClick={toggleSettings}
        >
          <FaCog />
        </div>
        <div
          className="w-10 h-10 bg-gray-900 text-white border-none rounded shadow-md flex justify-center items-center text-xl my-1 hover:bg-gray-700 hover:scale-110 transition-transform hover: cursor-pointer"
          onClick={toggleInvite}
        >
          <FaShareSquare />
        </div>
        <div
          className="w-10 h-10 bg-gray-900 text-white border-none rounded shadow-md flex justify-center items-center text-xl my-1 hover:bg-gray-700 hover:scale-110 transition-transform hover: cursor-pointer"
          onClick={saveWhiteboard}
        >
          <AiFillSave />
        </div>
      </div>
      {settingsOpen && <Settings />}
      {inviteOpen && <Invite />}
    </>
  );
};

export default Sidebar;