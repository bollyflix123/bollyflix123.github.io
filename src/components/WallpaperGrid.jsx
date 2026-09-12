import React from "react";
import WallpaperCard from "./WallpaperCard";
import EmptyState from "./EmptyState";

export const WallpaperGrid = ({ wallpapers, emptyMessage, onReset }) => {
  if (!wallpapers || wallpapers.length === 0) {
    return <EmptyState message={emptyMessage} onReset={onReset} />;
  }

  return (
    <div className="wallpaper-grid">
      {wallpapers.map((wallpaper, idx) => (
        <WallpaperCard key={wallpaper.id || wallpaper.slug || idx} wallpaper={wallpaper} />
      ))}
    </div>
  );
};

export default WallpaperGrid;
