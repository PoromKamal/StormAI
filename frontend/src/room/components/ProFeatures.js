import React from 'react';
import PayButton from './PayButton';
//import './ProFeatures.css';

const ProFeatures = () => {
  return (
    <div className="pro-features-container">
      <h1 className="pro-features-title">Pro Features of My App</h1>
      <p className="pro-features-description">Upgrade to the pro version of My App to enjoy the following features:</p>
      <ul className="pro-features-list">
        <li className="pro-feature">Feature 1</li>
        <li className="pro-feature">Feature 2</li>
        <li className="pro-feature">Feature 3</li>
        <li className="pro-feature">Feature 4</li>
        <li className="pro-feature">Feature 5</li>
      </ul>
      <p className="pro-features-upgrade">Don't miss out on these amazing features. Upgrade now!</p>
      <PayButton />
    </div>
  );
};

export default ProFeatures;
