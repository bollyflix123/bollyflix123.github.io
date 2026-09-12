import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import "./StateViews.css";

export const ErrorState = ({ message = "Unable to load wallpapers. Please try again later.", onRetry }) => {
  return (
    <div className="state-view glass-panel">
      <div className="state-icon error-icon">
        <AlertTriangle size={36} color="#ef4444" />
      </div>
      <h3 className="state-title">Something went wrong</h3>
      <p className="state-message">{message}</p>
      {onRetry && (
        <button className="btn btn-primary state-btn" onClick={onRetry}>
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
