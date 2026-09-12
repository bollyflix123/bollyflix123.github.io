import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import "./SearchBar.css";

export const SearchBar = ({ initialQuery = "", onSearch, placeholder = "Search wallpapers by title, category, tags..." }) => {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <form className="search-bar-form" onSubmit={handleSubmit}>
      <div className="search-bar-inner">
        <Search className="search-bar-icon" size={20} />
        <input
          type="text"
          className="search-bar-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search wallpapers"
        />
        {query && (
          <button type="button" className="search-clear-btn" onClick={handleClear} aria-label="Clear search">
            <X size={18} />
          </button>
        )}
        <button type="submit" className="btn btn-primary search-bar-submit">
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
