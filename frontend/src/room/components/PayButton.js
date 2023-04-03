import axios from "axios"
import React from 'react';
import { useState, createContext, useEffect } from 'react'; 
import apiService from '../../services/apiService';

const PayButton = () => {
    const [user, setUser] = useState({ authenticated: false });
        useEffect(() => {
          apiService.getMe().then((response) => {
            let user = {};
            if (response.error != null){
                user = {"authenticated": false};
            }else{
                user = {"authenticated": true, "username": response.username,"email": response.email};
            }
            setUser(user);
        });
        }, [])
    const handleCheckout = () =>{
        
        const email = user.email;
        console.log("EMAIL:", email);
        axios.post(`${process.env.REACT_APP_PAYMENT_SERVER}/api/stripe/create-checkout-session`, { email: user.email }).then((res)=>{
            if(res.data.url){
                window.location.href = res.data.url;     
            }
        })

    }
    return (
        <button onClick ={()=>handleCheckout()}>Purchase StormAI Pro!</button>
    )

}
export default PayButton;