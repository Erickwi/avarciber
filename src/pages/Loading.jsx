import React from 'react';
import "../index.css";

const LoadingComponent = () => {
  return (
    <div className="loading-page">
      <div className="loading-container">
        <div className="loading-text">Se están recuperando los datos</div>
        <div className="loading-bar">
          <div className="filler"></div>
        </div>
        <div className="loading-text-small">Loading...</div>
        <div className="please-wait-text">Please wait</div>
      </div>
    </div>
  );
};

export default LoadingComponent;