import React, { useState, useContext, useEffect } from "react";
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { FaRegUserCircle, FaRobot, FaPaintBrush } from 'react-icons/fa';
import {RiQuestionnaireFill} from "react-icons/ri"
import { MdHistoryEdu } from 'react-icons/md';
import { YjsContext } from '../../../room/components/Room';
import apiService from "../../../services/apiService";
import ToolTip from '@mui/material/Tooltip'
import { MdQuestionAnswer } from 'react-icons/md';
import { useNavigate } from "react-router-dom";

const AiDropdownButton = () => {
  const { yDoc, yjsProvider } = useContext(YjsContext);
  const [user, setUser] = useState({ "authenticated": false });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleRoutePayment = () => {
    navigate("/proFeatures");
  }

  useEffect(() => {
    apiService.getMe().then((response) => {
      let user = {};
      if (response.error != null) {
        user = { "authenticated": false };
      } else {
        user = { "authenticated": true, data: response };
      }
      console.log(response);
      setUser(user);
    });
  }, [dropdownOpen]);

  const toggleModal = () => {
    setDropdownOpen(!dropdownOpen);
  }

  return (
    <>
      <div className="my-1 w-10 h-10 bg-gray-900 text-white border-none rounded shadow-md flex justify-center items-center text-xl hover:bg-gray-700 hover:scale-110 transition-transform hover: cursor-pointer"
        onClick={toggleModal}>
        <FaRobot />
      </div>
      {dropdownOpen && user.authenticated &&
        <div className="flex flex-col text-center left-10 top-1/2 -translate-y-1/2 fixed w-72 h-72 p-4 mr-14 mt-2 border rounded-md bg-gray-900 text-white opacity-90 z-50 shadow">
          <div className="mb-5">
            <ToolTip title="Drag these onto the board!">
              <div className="m-2 w-5 h-5 bg-gray-700 text-white border-none rounded-full shadow-md flex justify-center items-center text-xl hover:bg-gray-700 hover:scale-110 transition-transform hover: cursor-pointer">
                <AiOutlineInfoCircle />
              </div>
            </ToolTip>

            <div className="flex items-center">
              <div className="m-2 w-10 h-10 bg-gray-700 text-white border-none rounded shadow-md flex justify-center items-center text-xl hover:bg-gray-700 hover:scale-110 transition-transform hover: cursor-pointer"
                onDragStart={(event) => onDragStart(event, "story")}
                draggable>
                <MdHistoryEdu />
              </div>
              <div>Story bot</div>
            </div>
            <div className="flex items-center">
              <div className="m-2 w-10 h-10 bg-gray-700 text-white border-none rounded shadow-md flex justify-center items-center text-xl hover:bg-gray-700 hover:scale-110 transition-transform hover: cursor-pointer"
                onDragStart={(event) => onDragStart(event, "artist")}
                draggable>
                <FaPaintBrush />
              </div>
              <div>Artist bot</div>
            </div>
            <div className="flex items-center">
              <div className="m-2 w-10 h-10 bg-gray-700 text-white border-none rounded shadow-md flex justify-center items-center text-xl hover:bg-gray-700 hover:scale-110 transition-transform hover: cursor-pointer"
                onDragStart={(event) => onDragStart(event, "chat")}
                draggable>
                <RiQuestionnaireFill />
              </div>
              <div>Question bot</div>
            </div>
          </div>
        </div>
      }
      { dropdownOpen && !user.authenticated &&
        <div className="flex flex-col text-center left-10 top-1/4 -translate-y-1/2 fixed w-72 h-fit p-4 mr-14 mt-2 border rounded-md bg-gray-900 text-white opacity-90 z-50 shadow">
          Please <a className="underline" href={`${process.env.REACT_APP_AUTH_SERVER}/oauth2/authorization/auth0`}>Login</a> to use bots!
        </div>
      }
    </>
  );
}

export default AiDropdownButton;