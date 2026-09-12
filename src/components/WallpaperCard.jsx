import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, Monitor, Eye, ImageOff } from "lucide-react";
import "./WallpaperCard.css";

export const WallpaperCard = ({ wallpaper }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  if (!wallpaper) return null;

  const { title, slug, image_url, category, resolution, description } = wallpaper;

  // Fallback placeholder image URL
  const displayImage = imageError || !image_url
    ? "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80"
    : image_url;

  const detailUrl = `/wallpaper/${slug}`;

  const handleCardClick = (e) => {
    // Navigate to details page when clicked
    navigate(detailUrl);
  };

  return (
    <article className="wallpaper-card glass-panel" onClick={handleCardClick}>
      {/* Image Container with Aspect Ratio Box */}
      <div className="card-image-wrapper">
        {!imageLoaded && !imageError && <div className="card-image-skeleton skeleton" />}
        <img
          src={displayImage}
          alt={title ? `${title} Wallpaper` : "HD Wallpaper"}
          loading="lazy"
          className={`card-image ${imageLoaded ? "loaded" : ""}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />

        {/* Overlay Hover Actions */}
        <div className="card-overlay">
          <Link to={detailUrl} className="overlay-btn view-btn" onClick={(e) => e.stopPropagation()}>
            <Eye size={18} />
            <span>Preview</span>
          </Link>
          <Link to={detailUrl} className="overlay-btn download-btn" onClick={(e) => e.stopPropagation()}>
            <Download size={18} />
            <span>Download</span>
          </Link>
        </div>

        {/* Resolution Badge */}
        {resolution && (
          <div className="card-badge resolution-badge">
            <Monitor size={12} />
            <span>{resolution}</span>
          </div>
        )}

        {/* Category Badge */}
        {category && (
          <div className="card-badge category-badge">
            <span>{category}</span>
          </div>
        )}
      </div>

      {/* Card Details Body */}
      <div className="card-body">
        <h3 className="card-title" title={title}>
          <Link to={detailUrl} onClick={(e) => e.stopPropagation()}>
            {title}
          </Link>
        </h3>

        {description && <p className="card-desc">{description}</p>}

        {/* Action Footer */}
        <div className="card-footer">
          <span className="card-meta">
            {category} {resolution ? `• ${resolution}` : ""}
          </span>
          <Link
            to={detailUrl}
            className="btn btn-secondary btn-sm card-action-btn"
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={15} />
            <span>Download</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default WallpaperCard;
