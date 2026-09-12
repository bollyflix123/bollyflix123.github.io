import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Play, Flame, Film, Download } from "lucide-react";
import siteConfig from "../config/siteConfig";
import TrailerModal from "./TrailerModal";
import "./HeroSection.css";

export const HeroSection = ({ featuredMovie }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const trending = featuredMovie || {
    title: "Oppenheimer",
    slug: "oppenheimer-2023",
    image_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1400&q=80",
    trailer_url: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    youtube_embed_url: "https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    category: "Movie",
    author: "★ 8.9 • Christopher Nolan",
    published_date: "2023"
  };

  return (
    <section className="hero-section">
      <div className="hero-glow-bg"></div>

      {/* Featured Backdrop Background */}
      <div className="hero-backdrop">
        <img src={trending.image_url} alt={trending.title} loading="lazy" decoding="async" className="backdrop-img" />
        <div className="backdrop-overlay"></div>
      </div>

      <div className="container hero-container">
        
        {/* Cinema Badge */}
        <div className="hero-badge">
          <Flame size={14} color="#e50914" />
          <span>FilmyZilla • HD Movies & Web Series Streaming</span>
        </div>

        {/* Title */}
        <h1 className="hero-title">
          Watch & Download <br />
          <span className="gradient-text-red">HD Movies & Web Series</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Stream official HD video trailers and download full movies & web series online.
        </p>

        {/* Featured Movie Spotlight Banner Card */}
        <div className="spotlight-card glass-panel">
          <div className="spotlight-badge">FEATURED BLOCKBUSTER</div>
          <h2 className="spotlight-title">{trending.title}</h2>
          <div className="spotlight-meta">
            <span className="badge badge-red">{trending.category}</span>
            <span className="spotlight-rating">{trending.author}</span>
            <span className="spotlight-year">{trending.published_date}</span>
          </div>
          <p className="spotlight-desc">{trending.description}</p>
          <div className="spotlight-actions">
            <button className="btn btn-primary hero-play-btn" onClick={() => setIsTrailerOpen(true)}>
              <Play size={18} fill="#fff" />
              <span>Watch Official Trailer</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/movie/${trending.slug}`)}
            >
              <Download size={18} />
              <span>Stream / Download</span>
            </button>
          </div>
        </div>

        {/* Live Search Form */}
        <form className="hero-search-form" onSubmit={handleSearchSubmit}>
          <div className="hero-search-input-wrapper">
            <Search className="hero-search-icon" size={22} />
            <input
              type="text"
              className="hero-search-input"
              placeholder="Search movie, web series, director, actor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search movies"
            />
            <button type="submit" className="btn btn-primary hero-search-btn">
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Popular Genre Chips */}
        <div className="hero-popular-tags">
          <span className="popular-label">
            <Film size={14} color="#e50914" /> Genres:
          </span>
          <div className="popular-chips">
            {siteConfig.POPULAR_GENRES.slice(0, 7).map((genre) => (
              <button
                key={genre.name}
                className="chip"
                onClick={() => navigate(`/genre/${genre.name.toLowerCase()}`)}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Trailer Modal */}
      <TrailerModal
        movie={trending}
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
      />
    </section>
  );
};

export default HeroSection;
