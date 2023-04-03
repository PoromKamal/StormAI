import React, { useState, useContext, useEffect }  from "react";
import { FaRegUserCircle } from 'react-icons/fa';
import { YjsContext } from '../../../room/components/Room';
import apiService from "../../../services/apiService";

const AuthButton = () => {
    const { yDoc, yjsProvider } = useContext(YjsContext);
    const [user, setUser] = useState({"authenticated": false});
    const [loginOpen, setLoginOpen] = useState(false);
      
    useEffect(() => {
        apiService.getMe().then((response) => {
            let user = {};
            if(response.error != null){
                user = {"authenticated": false};
            }else{
                user = {"authenticated": true, "username": response.username};
            }
            setUser(user);
            console.log(response);
            console.log(user);
        });
    }, [loginOpen]);

    const toggleModal = () => {
        setLoginOpen(!loginOpen);
    }

    return (
        <>
            <div className="z-50 top-12 right-0 m-2 absolute w-10 h-10 bg-gray-900 text-white border-none rounded shadow-md flex justify-center items-center text-xl hover:bg-gray-700 hover:scale-110 transition-transform hover: cursor-pointer"
            onClick={toggleModal}
            >
                <FaRegUserCircle/>
            </div>
            {loginOpen ? 
                    user.authenticated ?                 
                    <div className='flex flex-col items-start justify-center text-center fixed top-12 right-0 w-64 p-4 mr-14 mt-2 border rounded-md bg-gray-900 text-white opacity-90 z-50 shadow'>
                        <div className="mb-5 text-center">Hello {user.username}!</div>
                        <a className='mb-4 text-center font-bold' href={`${process.env.REACT_APP_AUTH_SERVER}/logout`}>Logout</a>
                    </div>
                    :
                    <div className='flex flex-col items-start justify-center text-center fixed top-12 right-0 w-64 p-4 mr-14 mt-2 border rounded-md bg-gray-900 text-white opacity-90 z-50 shadow'>
                        <div className="mb-5 text-center">No user currently logged in.</div>
                        <a className='mb-4 text-center font-bold' href={`${process.env.REACT_APP_AUTH_SERVER}/oauth2/authorization/auth0`}>Login/Signup</a>
                    </div>
                : null
            } 
        </>
    );
}

export default AuthButton;