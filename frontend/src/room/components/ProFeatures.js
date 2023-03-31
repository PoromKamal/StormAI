import React from 'react';
import { useState, createContext, useEffect } from 'react'; 
import PayButton from './PayButton';
import './ProFeatures.css';
import apiService from '../../services/apiService';

const ProFeatures = () => {
  const [user, setUser] = useState({ authenticated: false });
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
  }, [])
  return (
    
    <div className="pro-features-container">
      <h1 className="pro-features-title h-20 text-6xl font-semibold text-storm-blue animate-introText animate-text 
      bg-gradient-to-r from-blue-900 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">StormAI PRO</h1>
      <p className="pro-features-description">Upgrade to the pro version of Storm AI to enjoy the following features:</p>
      <ul className="pro-features-list">
        <li className="pro-feature">Feature 1</li>
        <li className="pro-feature">Feature 2</li>
        <li className="pro-feature">Feature 3</li>
        <li className="pro-feature">Feature 4</li>
        <li className="pro-feature">Feature 5</li>
      </ul>
      <p className="pro-features-upgrade">Don't miss out on these amazing features. Upgrade now!</p>
      <p className="proButton"><PayButton /></p>
    </div>
  );
};

export default ProFeatures;
