import axios from "axios"
import { RiThunderstormsFill } from "react-icons/ri"
import { useState, useEffect } from "react"
import apiService from "../../services/apiService"
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const [user, setUser] = useState({"authenticated": false});
    const [hover, setHover] = useState(false);
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
        })
    }, []);

    const handlePricingClick = () => {
        navigate('/ProFeatures');
      };
    

    const handleEnter = () => {
        setHover(true)
    };

    const handleLeave = () => {
        setHover(false)
    };
    
    const animateText = "hover:animate-text hover:bg-gradient-to-r from-blue-900 via-indigo-500 to-cyan-400 bg-clip-text hover:text-transparent"

    return (
        <div className="right-10 top-0 flex flex-col absolute z-10 font-Lato text-2xl mt-12 font-bold text-storm-blue">
            <div className={`transition-all hover:font-extrabold hover:scale-x-110 cursor-pointer ${animateText}`}
                onClick={handlePricingClick}>
                PRICING \
            </div>
            <div className={`transition-all my-10 hover:font-extrabold hover:scale-x-110 cursor-pointer ${animateText}`}>
                ABOUT \
            </div>
            {
                user.authenticated ? 
                <div
                    onMouseEnter={handleEnter}
                    onMouseLeave={handleLeave}>
                    <div className={`transition-all hover:font-extrabold hover:scale-x-110 cursor-pointer ${animateText}`}>
                        {user.username.toUpperCase()} \
                    </div>
                    <div className="flex flex-col gap-3">
                        <a className={` transition-all duration-1000 ${hover ? "animate-logo": "hidden" }  hover:font-extrabold hover:scale-x-110 cursor-pointer text-xl ${animateText}`}
                                onClick={()=>navigate("/savedBoards")}>
                                SAVED \
                        </a>
                        <a className={` transition-all duration-1000 ${hover ? "animate-logo": "hidden" }  hover:font-extrabold hover:scale-x-110 cursor-pointer text-xl ${animateText}`}
                                href={`${process.env.REACT_APP_AUTH_SERVER}/logout`}>
                                LOGOUT \
                        </a>
                    </div>
                </div> :
                <a className={`transition-all hover:font-extrabold hover:scale-x-110 cursor-pointer ${animateText}`}
                    href={`${process.env.REACT_APP_AUTH_SERVER}/oauth2/authorization/auth0`}>
                    LOGIN \
                </a>
            }
        </div>
    )

}
export default NavBar;