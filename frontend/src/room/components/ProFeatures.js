import React from 'react';

const ProFeatures = () => {
  const proFeaturesHtml = `
    <h1>Pro Features of My App</h1>
    <p>Upgrade to the pro version of My App to enjoy the following features:</p>
    <ul>
      <li>Feature 1</li>
      <li>Feature 2</li>
      <li>Feature 3</li>
      <li>Feature 4</li>
      <li>Feature 5</li>
    </ul>
    <p>Don't miss out on these amazing features. Upgrade now!</p>
  `;

  return (
    <div dangerouslySetInnerHTML={{ __html: proFeaturesHtml }} />
  );
};

export default ProFeatures;