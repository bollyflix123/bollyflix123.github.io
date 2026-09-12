import React, { useEffect } from "react";
import { X, ExternalLink, Play } from "lucide-react";
import { getYouTubeEmbedUrl } from "../utils/youtube";
import "./TrailerModal.css";

export const TrailerModal = ({ movie, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !movie) return null;

  const embedUrl = movie.youtube_embed_url || getYouTubeEmbedUrl(movie.trailer_url);

  return (
    <div className="trailer-modal-overlay" onClick={onClose}>
      <div className="trailer-modal-container glass-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="trailer-modal-header">
          <div className="modal-title-wrap">
            <Play size={18} className="play-icon-red" />
            <h3 className="modal-movie-title">{movie.title} - Official Trailer</h3>
            {movie.published_date && <span className="modal-year">({movie.published_date})</span>}
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close trailer">
            <X size={24} />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="trailer-player-wrapper">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`${movie.title} Official Trailer`}
              className="trailer-iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="trailer-unavailable">
              <p>Trailer preview is unavailable for this movie.</p>
              {movie.trailer_url && (
                <a
                  href={movie.trailer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <ExternalLink size={16} /> Open Trailer Link
                </a>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Info */}
        <div className="trailer-modal-footer">
          <div className="modal-meta-chips">
            <span className="badge badge-red">{movie.category}</span>
            {movie.author && <span className="badge badge-dark">{movie.author}</span>}
          </div>
          <p className="modal-synopsis">{movie.description}</p>
        </div>

      </div>
    </div>
  );
};

export default TrailerModal;
