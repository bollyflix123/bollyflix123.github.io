import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import Breadcrumb from "../components/Breadcrumb";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import { searchMovies } from "../services/googleSheets";
import { setPageSEO } from "../utils/seo";
import siteConfig from "../config/siteConfig";
import "./Pages.css";

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = siteConfig.ITEMS_PER_PAGE;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = async (term) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchMovies(term);
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("Error executing movie search query.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch(query);

    const seoTitle = query
      ? `Search results for "${query}" | ${siteConfig.SITE_NAME}`
      : `Search Movies & Web Series | ${siteConfig.SITE_NAME}`;

    setPageSEO({
      title: seoTitle,
      description: `Search results for ${query || "movies and web series"} in high definition.`
    });
  }, [query]);

  const handleSearchSubmit = (newQuery) => {
    setSearchParams({ q: newQuery, page: "1" });
  };

  const handlePageChange = (page) => {
    setSearchParams({ q: query, page: page.toString() });
  };

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentResults = results.slice(startIndex, startIndex + itemsPerPage);

  const breadcrumbs = [
    { name: "Search", url: "/search" },
    ...(query ? [{ name: `"${query}"`, url: `/search?q=${encodeURIComponent(query)}` }] : [])
  ];

  return (
    <div className="search-page container page-padding">
      <Breadcrumb items={breadcrumbs} />

      <div className="page-header search-header">
        <h1 className="page-main-title">
          Search <span className="gradient-text-red">FilmyZilla</span>
        </h1>

        <div className="search-bar-wrapper">
          <SearchBar
            initialQuery={query}
            onSearch={handleSearchSubmit}
            placeholder="Search movie, web series, director, actor, genre..."
          />
        </div>

        {query && !loading && (
          <p className="search-meta">
            Found <strong>{results.length}</strong> movies & series matching "<strong>{query}</strong>"
          </p>
        )}
      </div>

      {loading ? (
        <LoadingSkeleton count={12} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => performSearch(query)} />
      ) : (
        <>
          <MovieGrid
            movies={currentResults}
            emptyMessage={
              query
                ? `No movies or series found matching "${query}". Try searching for another movie title, actor, or genre.`
                : "Type a keyword above to search movies by title, director, or genre."
            }
            onReset={() => handleSearchSubmit("")}
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

export default SearchPage;
