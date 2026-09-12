import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import { fetchMovies, getFeaturedMovies, getGenres } from "../services/googleSheets";
import { setPageSEO } from "../utils/seo";
import siteConfig from "../config/siteConfig";
import { Flame, Film, ArrowRight, Sparkles } from "lucide-react";
import "./Pages.css";

export const Home = () => {
  const [movies, setMovies] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = siteConfig.ITEMS_PER_PAGE;

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allData, featuredData, genreData] = await Promise.all([
        fetchMovies(),
        getFeaturedMovies(6),
        getGenres()
      ]);
      setMovies(allData);
      setFeatured(featuredData);
      setGenres(genreData);
    } catch (err) {
      console.error(err);
      setError("Failed to load movies from Google Sheets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setPageSEO({
      title: siteConfig.DEFAULT_SEO_TITLE,
      description: siteConfig.DEFAULT_SEO_DESCRIPTION
    });
  }, []);

  const totalPages = Math.ceil(movies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMovies = movies.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  return (
    <div className="home-page">
      {/* Cinematic Hero Section */}
      <HeroSection featuredMovie={featured.length > 0 ? featured[0] : null} />

      <div className="container main-content-section">
        
        {/* Featured Blockbusters Section */}
        {currentPage === 1 && featured.length > 0 && !loading && !error && (
          <section className="featured-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <Flame size={22} color="#e50914" />
                <h2 className="section-title">Trending Blockbusters</h2>
              </div>
              <span className="section-subtitle">Top rated movies & web series with trailers</span>
            </div>
            <MovieGrid movies={featured} />
          </section>
        )}

        {/* Popular Genres Bar */}
        {genres.length > 0 && !loading && (
          <section className="categories-bar">
            <h3 className="cat-bar-title">Explore Genres:</h3>
            <div className="cat-bar-chips">
              {genres.slice(0, 10).map((g) => (
                <Link
                  key={g.name}
                  to={`/genre/${g.slug}`}
                  className="cat-bar-chip"
                >
                  <span>{g.name}</span>
                  <span className="cat-count">({g.count})</span>
                </Link>
              ))}
              <Link to="/genres" className="cat-bar-chip explore-all">
                All Genres <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        )}

        {/* Latest Movies & Series Library Section */}
        <section className="latest-section" id="latest-movies">
          <div className="section-header">
            <div className="section-title-wrap">
              <Film size={22} color="#e50914" />
              <h2 className="section-title">
                {currentPage > 1 ? `Movies & Web Series - Page ${currentPage}` : "Latest Movies & Web Series"}
              </h2>
            </div>
            <span className="section-subtitle">
              Showing {movies.length ? `${startIndex + 1}-${Math.min(startIndex + itemsPerPage, movies.length)} of ${movies.length}` : "0"} titles
            </span>
          </div>

          {loading ? (
            <LoadingSkeleton count={12} />
          ) : error ? (
            <ErrorState message={error} onRetry={loadData} />
          ) : (
            <>
              <MovieGrid movies={currentMovies} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>

      </div>
    </div>
  );
};

export default Home;
