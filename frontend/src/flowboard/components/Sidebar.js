import { useState } from 'react';
import { FaRegStickyNote, FaPen, FaCog, FaShareSquare } from 'react-icons/fa';
import AiDropdownButton from './button/AiDropdownButton';
import Settings from './Settings';
import Invite from './Invite';

const onDragStart = (event, nodeType) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const Sidebar = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const toggleSettings = () => {
    if (inviteOpen) toggleInvite();
    setSettingsOpen(!settingsOpen);
  };

  const toggleInvite = () => {
    if (settingsOpen) toggleSettings();
    setInviteOpen(!inviteOpen);
  };

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
      </div>
      {settingsOpen && <Settings />}
      {inviteOpen && <Invite />}
    </>
  );
};

export default Sidebar;