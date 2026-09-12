import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import Breadcrumb from "../components/Breadcrumb";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import { fetchMovies, getGenres } from "../services/googleSheets";
import { setPageSEO } from "../utils/seo";
import siteConfig from "../config/siteConfig";
import { Film, Filter } from "lucide-react";
import "./Pages.css";

export const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = siteConfig.ITEMS_PER_PAGE;

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allData, genreData] = await Promise.all([
        fetchMovies(),
        getGenres()
      ]);
      setMovies(allData);
      setGenres(genreData);
    } catch (err) {
      console.error(err);
      setError("Failed to load movies library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setPageSEO({
      title: "Movies & Web Series Library | FilmyZilla",
      description: "Browse our complete catalog of 4K & 1080p Movies, Web Series, and Anime with trailers."
    });
  }, []);

  const filteredMovies = selectedFormat === "all"
    ? movies
    : movies.filter((m) => m.category.toLowerCase() === selectedFormat.toLowerCase());

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMovies = filteredMovies.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    const params = { page: page.toString() };
    if (selectedFormat !== "all") params.format = selectedFormat;
    setSearchParams(params);
  };

  const handleFormatFilter = (fmt) => {
    setSelectedFormat(fmt);
    setSearchParams({ page: "1" });
  };

  return (
    <div className="movies-page container page-padding">
      <Breadcrumb items={[{ name: "Movies & Series", url: "/movies" }]} />

      <div className="page-header-bar">
        <div>
          <h1 className="page-main-title">
            Movies & <span className="gradient-text-red">Web Series</span>
          </h1>
          <p className="page-sub-title">Explore over {movies.length} high definition movies and web series</p>
        </div>

        {/* Filter Dropdown */}
        <div className="filter-wrapper">
          <Filter size={16} color="#e50914" />
          <select
            className="category-select"
            value={selectedFormat}
            onChange={(e) => handleFormatFilter(e.target.value)}
            aria-label="Filter by Format"
          >
            <option value="all">All Formats ({movies.length})</option>
            <option value="movie">Movies</option>
            <option value="web series">Web Series</option>
            <option value="anime">Anime</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={12} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <>
          <MovieGrid
            movies={currentMovies}
            emptyMessage="No movies or web series found matching the selected filter."
            onReset={() => handleFormatFilter("all")}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Movies;
