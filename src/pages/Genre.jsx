import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import Breadcrumb from "../components/Breadcrumb";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import { getMoviesByGenre } from "../services/googleSheets";
import { setPageSEO } from "../utils/seo";
import siteConfig from "../config/siteConfig";
import "./Pages.css";

export const Genre = () => {
  const { genre: genreParam } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = siteConfig.ITEMS_PER_PAGE;

  const displayGenreName = genreParam
    ? genreParam.charAt(0).toUpperCase() + genreParam.slice(1).replace(/-/g, " ")
    : "Genre";

  const loadGenreData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMoviesByGenre(genreParam);
      setMovies(data);
    } catch (err) {
      console.error(err);
      setError(`Failed to load ${displayGenreName} movies.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (genreParam) {
      loadGenreData();
      setPageSEO({
        title: `${displayGenreName} Movies & Web Series | ${siteConfig.SITE_NAME}`,
        description: `Download free 4K and Full HD ${displayGenreName} movies and web series with trailers.`
      });
    }
  }, [genreParam]);

  const totalPages = Math.ceil(movies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMovies = movies.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  const breadcrumbs = [
    { name: "Genres", url: "/genres" },
    { name: displayGenreName, url: `/genre/${genreParam}` }
  ];

  return (
    <div className="category-page container page-padding">
      <Breadcrumb items={breadcrumbs} />

      <div className="page-header-bar">
        <div>
          <h1 className="page-main-title">
            {displayGenreName} <span className="gradient-text-red">Movies & Series</span>
          </h1>
          <p className="page-sub-title">Showing {movies.length} curated {displayGenreName} titles</p>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={12} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadGenreData} />
      ) : (
        <>
          <MovieGrid
            movies={currentMovies}
            emptyMessage={`No movies or web series found in the "${displayGenreName}" genre.`}
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

export default Genre;
