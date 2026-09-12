import React from "react";
import { ImageOff, RotateCcw } from "lucide-react";
import "./StateViews.css";

export const EmptyState = ({ message = "No wallpapers found.", onReset }) => {
  return (
    <div className="state-view glass-panel">
      <div className="state-icon empty-icon">
        <ImageOff size={36} color="#38bdf8" />
      </div>
      <h3 className="state-title">No Wallpapers Found</h3>
      <p className="state-message">{message}</p>
      {onReset && (
        <button className="btn btn-secondary state-btn" onClick={onReset}>
          <RotateCcw size={16} />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
