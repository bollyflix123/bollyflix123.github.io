import React from "react";
import "./LoadingSkeleton.css";

export const LoadingSkeleton = ({ count = 8, type = "grid" }) => {
  if (type === "details") {
    return (
      <div className="skeleton-details-container glass-panel">
        <div className="skeleton-preview skeleton"></div>
        <div className="skeleton-meta-side">
          <div className="skeleton-line title skeleton"></div>
          <div className="skeleton-line cat skeleton"></div>
          <div className="skeleton-box matrix skeleton"></div>
          <div className="skeleton-line btn-sk skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallpaper-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="skeleton-card glass-panel">
          <div className="skeleton-thumb skeleton"></div>
          <div className="skeleton-body">
            <div className="skeleton-line header skeleton"></div>
            <div className="skeleton-line sub skeleton"></div>
            <div className="skeleton-footer skeleton"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
