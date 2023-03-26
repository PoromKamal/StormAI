import React, { useState, useContext, useEffect }  from "react";
import { FaRegUserCircle, FaRobot } from 'react-icons/fa';
import { MdHistoryEdu } from 'react-icons/md';
import { YjsContext } from '../../../room/components/Room';
import apiService from "../../../services/apiService";
import ToolTip from '@mui/material/Tooltip'

const AiDropdownButton = () => {
    const { yDoc, yjsProvider } = useContext(YjsContext);
    const [user, setUser] = useState({"authenticated": false});
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    useEffect(() => {
        apiService.getMe().then((response) => {
            let user = {};
            if(response.error != null){
                user = {"authenticated": false};
            }else{
                user = {"authenticated": true, "username": response.username};
            }
            setUser(user);
        });
    }, [dropdownOpen]);

    const toggleModal = () => {
        setDropdownOpen(!dropdownOpen);
    }

    return (
        <>
            <div className="z-50 top-24 right-0 m-2 absolute w-10 h-10 bg-gray-900 text-white border-none rounded shadow-md flex justify-center items-center text-xl hover:bg-gray-700 hover:scale-110 transition-transform hover: cursor-pointer"
                onClick={toggleModal}>
                <FaRobot/>
            </div>
            {dropdownOpen &&
            <div className="flex flex-col text-center fixed top-24 right-0 w-72 h-64 p-4 mr-14 mt-2 border rounded-md bg-gray-900 text-white opacity-90 z-50 shadow">
                <div className="flex items-center mb-10">
                    <ToolTip title="Drag onto board!">
                        <div className="m-2 w-10 h-10 bg-gray-700 text-white border-none rounded shadow-md flex justify-center items-center text-xl hover:bg-gray-700 hover:scale-110 transition-transform hover: cursor-pointer"
                            onDragStart={(event) => onDragStart(event, "story")}
                            draggable>
                            <MdHistoryEdu/>
                        </div>
                    </ToolTip>
                    <div>Story bot</div>
                </div>
                Subscribe for more bots!
            </div>
            } 
        </>
    );
}

export default AiDropdownButton;