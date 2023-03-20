import { useState } from 'react';
import { FaRegStickyNote, FaPen, FaCog } from 'react-icons/fa';
import Settings from './Settings';

const onDragStart = (event, nodeType) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const Sidebar = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  return (
    <>
      <div className='absolute top-1/2 -translate-y-1/2 border-none ml-4 h-96 bg-transparent flex flex-col items-center justify-center'>
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
      </div>
      {settingsOpen && <Settings />}
    </>
  );
};

export default Sidebar;