import React from 'react';

const ErrorBanner = ({ message, onDismiss }) => {
  return (
    <div className="error-banner fade-in" role="alert">
      <div className="error-content">
        <span className="error-icon">⚠</span>
        <span className="error-message">{message}</span>
      </div>
      <button 
        className="error-dismiss" 
        onClick={onDismiss}
        aria-label="Dismiss error"
      >
        ×
      </button>
    </div>
  );
};

export default ErrorBanner;
