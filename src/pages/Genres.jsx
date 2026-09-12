import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import { getGenres } from "../services/googleSheets";
import { setPageSEO } from "../utils/seo";
import siteConfig from "../config/siteConfig";
import { Film, ArrowRight } from "lucide-react";
import "./Categories.css";

export const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGenreData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGenres();
      setGenres(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load movie genres.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGenreData();
    setPageSEO({
      title: `Movie & Series Genres | ${siteConfig.SITE_NAME}`,
      description: "Explore free HD & 4K movies and web series by genre: Action, Sci-Fi, Thriller, Drama, Anime, and Horror."
    });
  }, []);

  return (
    <div className="categories-page container page-padding">
      <Breadcrumb items={[{ name: "Genres", url: "/genres" }]} />

      <div className="page-header">
        <h1 className="page-main-title">
          Explore Movie <span className="gradient-text-red">Genres</span>
        </h1>
        <p className="page-sub-title">Find movies and web series tailored to your favorite genre</p>
      </div>

      {loading ? (
        <div className="category-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="cat-card-skeleton skeleton"></div>
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadGenreData} />
      ) : (
        <div className="category-grid">
          {genres.map((genre) => (
            <Link
              key={genre.name}
              to={`/genre/${genre.slug}`}
              className="category-card glass-panel"
            >
              <div className="cat-card-cover">
                <img src={genre.cover_image} alt={`${genre.name} genre`} loading="lazy" />
                <div className="cat-card-overlay"></div>
              </div>
              <div className="cat-card-content">
                <h3 className="cat-card-name">{genre.name}</h3>
                <span className="cat-card-count">{genre.count} Titles</span>
                <span className="cat-card-link">
                  Browse <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Genres;
