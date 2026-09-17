import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import MovieGrid from "../components/MovieGrid";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import { getMovieBySlug, getRelatedMovies } from "../services/googleSheets";
import { setPageSEO, generateMovieSchema, generateBreadcrumbSchema } from "../utils/seo";
import { getYouTubeEmbedUrl } from "../utils/youtube";
import siteConfig from "../config/siteConfig";
import {
  Download,
  Play,
  Star,
  User,
  Calendar,
  Tag,
  Share2,
  Check,
  ExternalLink,
  Clock,
  Globe,
  AlertCircle
} from "lucide-react";
import "./MovieDetails.css";

export const MovieDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadMovieDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const item = await getMovieBySlug(slug);
        if (!item) {
          setError("Movie or Web Series not found.");
          setLoading(false);
          return;
        }

        setMovie(item);

        const relatedItems = await getRelatedMovies(item, 6);
        setRelated(relatedItems);

        const seoTitle = item.meta_title || `${item.title} (${item.published_date || '2026'}) HD Stream & Download`;
        const seoDesc =
          item.meta_description ||
          item.description ||
          `Watch ${item.title} trailer, read plot summary, and stream/download online.`;

        const breadcrumbs = [
          { name: "Movies & Series", url: "/movies" },
          { name: item.category, url: `/category/${item.category.toLowerCase()}` },
          { name: item.title, url: `/movie/${item.slug}` }
        ];

        setPageSEO({
          title: seoTitle,
          description: seoDesc,
          keywords: item.tags,
          image: item.image_url,
          url: window.location.href,
          type: "video.movie",
          jsonLd: [
            generateMovieSchema(item),
            generateBreadcrumbSchema(breadcrumbs)
          ]
        });
      } catch (err) {
        console.error("Error loading movie details:", err);
        setError("Unable to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadMovieDetails();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [slug]);

  const handleDownloadStream = () => {
    if (!movie) return;
    const targetUrl = movie.download_url || movie.image_url;

    if (!targetUrl) {
      alert("Stream or download link is currently unavailable for this movie.");
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = targetUrl;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="container page-padding">
        <LoadingSkeleton type="details" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container page-padding">
        <ErrorState
          message={error || "Movie not found."}
          onRetry={() => navigate("/movies")}
        />
      </div>
    );
  }

  const tagsList = (movie.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const embedUrl = getYouTubeEmbedUrl(movie.youtube_embed_url || movie.trailer_url, false);

  const breadcrumbs = [
    { name: "Movies & Series", url: "/movies" },
    { name: movie.category, url: `/category/${movie.category.toLowerCase()}` },
    { name: movie.title, url: `/movie/${movie.slug}` }
  ];

  return (
    <article className="movie-details-page container page-padding">
      <Breadcrumb items={breadcrumbs} />

      {/* Embedded YouTube Trailer Hero Header */}
      {embedUrl && (
        <section className="trailer-banner-section glass-panel">
          <div className="trailer-banner-header">
            <div className="banner-title-wrap">
              <Play size={20} className="play-red" fill="#e50914" color="#e50914" />
              <h2>{movie.title} - Official Video Trailer</h2>
            </div>
            <span className="banner-badge">{movie.published_date}</span>
          </div>
          <div className="banner-video-container">
            <iframe
              src={embedUrl}
              title={`${movie.title} Official Trailer`}
              className="banner-iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      )}

      {/* Main Details Grid */}
      <div className="details-layout glass-panel">
        
        {/* Left Column: Poster Image */}
        <div className="details-preview-column">
          <div className="poster-container">
            <img
              src={movie.image_url || "https://images.unsplash.com/photo-1536440136628-849c177e76a1"}
              alt={movie.title}
              loading="lazy"
              decoding="async"
              className="details-poster-img"
            />
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="details-info-column">
          
          <div className="details-header">
            <div className="category-pill-wrap">
              <span className="badge badge-red">{movie.category}</span>
              {movie.author && (
                <span className="badge badge-dark flex-align">
                  <Star size={12} fill="#f59e0b" color="#f59e0b" /> {movie.author}
                </span>
              )}
            </div>

            <h1 className="details-title">
              {movie.title} {movie.published_date && <span className="year-span">({movie.published_date})</span>}
            </h1>
          </div>

          {/* Plot Synopsis */}
          {movie.description && (
            <div className="synopsis-box">
              <h3 className="section-label">Plot Synopsis</h3>
              <p className="details-description">{movie.description}</p>
            </div>
          )}

          {/* Technical Specs Matrix */}
          <div className="specs-matrix">
            <h3 className="specs-heading">Movie & Stream Information</h3>
            <div className="specs-grid">
              {movie.file_type && (
                <div className="spec-item">
                  <div className="spec-icon"><Globe size={16} color="#818cf8" /></div>
                  <div className="spec-content">
                    <span className="spec-label">Audio / Language</span>
                    <span className="spec-value">{movie.file_type}</span>
                  </div>
                </div>
              )}

              {movie.file_size && (
                <div className="spec-item">
                  <div className="spec-icon"><Clock size={16} color="#c084fc" /></div>
                  <div className="spec-content">
                    <span className="spec-label">Duration / Episodes</span>
                    <span className="spec-value">{movie.file_size}</span>
                  </div>
                </div>
              )}

              {movie.author && (
                <div className="spec-item">
                  <div className="spec-icon"><User size={16} color="#e50914" /></div>
                  <div className="spec-content">
                    <span className="spec-label">Rating / Director</span>
                    <span className="spec-value">{movie.author}</span>
                  </div>
                </div>
              )}

              {movie.published_date && (
                <div className="spec-item">
                  <div className="spec-icon"><Calendar size={16} color="#10b981" /></div>
                  <div className="spec-content">
                    <span className="spec-label">Release Year</span>
                    <span className="spec-value">{movie.published_date}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Genres / Tags */}
          {tagsList.length > 0 && (
            <div className="details-tags-section">
              <h4 className="tags-heading"><Tag size={14} /> Genres & Tags</h4>
              <div className="tags-chips">
                {tagsList.map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?q=${encodeURIComponent(tag)}`}
                    className="tag-chip"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="details-actions">
            <button
              className="btn btn-primary download-primary-btn red-btn"
              onClick={handleDownloadStream}
            >
              <Download size={20} />
              <span>Stream / Download Movie</span>
              <ExternalLink size={16} className="ext-icon" />
            </button>

            <button
              className="btn btn-secondary share-btn"
              onClick={handleShare}
              title="Share Movie Link"
            >
              {copied ? <Check size={18} color="#10b981" /> : <Share2 size={18} />}
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>
          </div>

          <p className="download-disclaimer">
            <AlertCircle size={14} /> High speed direct download stream link configured.
          </p>

        </div>

      </div>

      {/* Related Movies Section */}
      {related.length > 0 && (
        <section className="related-section">
          <div className="section-header">
            <h2 className="section-title">Related Movies & Series</h2>
            <span className="section-subtitle">More in {movie.category} and matching genres</span>
          </div>
          <MovieGrid movies={related} />
        </section>
      )}

    </article>
  );
};

export default MovieDetails;
