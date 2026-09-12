import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Download, Star } from "lucide-react";
import TrailerModal from "./TrailerModal";
import "./MovieCard.css";

export const MovieCard = ({ movie }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const navigate = useNavigate();

  if (!movie) return null;

  const { title, slug, image_url, category, author, published_date, tags } = movie;

  const displayImage = imageError || !image_url
    ? "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80"
    : image_url;

  const detailUrl = `/movie/${slug}`;

  const handlePlayTrailer = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsTrailerOpen(true);
  };

  const handleCardClick = () => {
    navigate(detailUrl);
  };

  return (
    <>
      <article className="movie-card glass-panel" onClick={handleCardClick}>
        {/* Poster Wrapper */}
        <div className="poster-wrapper">
          {!imageLoaded && !imageError && <div className="poster-skeleton skeleton" />}
          <img
            src={displayImage}
            alt={`${title} Movie Poster`}
            loading="lazy"
            decoding="async"
            className={`poster-image ${imageLoaded ? "loaded" : ""}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />

          {/* Hover Overlay with Trailer & Details triggers */}
          <div className="poster-overlay">
            <button className="overlay-play-btn" onClick={handlePlayTrailer} title="Watch Trailer">
              <Play size={24} fill="#fff" color="#fff" />
            </button>
            <div className="overlay-actions">
              <button className="card-btn btn-trailer" onClick={handlePlayTrailer}>
                <Play size={14} fill="#fff" /> Trailer
              </button>
              <Link to={detailUrl} className="card-btn btn-details" onClick={(e) => e.stopPropagation()}>
                <Download size={14} /> Stream/DL
              </Link>
            </div>
          </div>

          {/* Category Badge */}
          <div className="badge-group top-left">
            {category && <span className="badge badge-red">{category}</span>}
          </div>

          {/* Rating Badge */}
          {author && (
            <div className="rating-badge">
              <Star size={12} fill="#f59e0b" color="#f59e0b" />
              <span>{author}</span>
            </div>
          )}
        </div>

        {/* Poster Info Body */}
        <div className="movie-card-body">
          <div className="title-row">
            <h3 className="movie-title" title={title}>
              <Link to={detailUrl} onClick={(e) => e.stopPropagation()}>
                {title}
              </Link>
            </h3>
            {published_date && <span className="release-year">{published_date}</span>}
          </div>

          {tags && <p className="movie-genres">{tags}</p>}

          {/* Card Footer Actions */}
          <div className="movie-card-footer">
            <button className="quick-trailer-btn" onClick={handlePlayTrailer}>
              <Play size={13} fill="#e50914" color="#e50914" /> Watch Trailer
            </button>
            <Link to={detailUrl} className="quick-details-link" onClick={(e) => e.stopPropagation()}>
              Details →
            </Link>
          </div>
        </div>
      </article>

      {/* Embedded YouTube Trailer Modal */}
      <TrailerModal
        movie={movie}
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
      />
    </>
  );
};

export default MovieCard;
