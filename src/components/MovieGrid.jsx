import React from "react";
import MovieCard from "./MovieCard";
import EmptyState from "./EmptyState";

export const MovieGrid = ({ movies, emptyMessage, onReset }) => {
  if (!movies || movies.length === 0) {
    return <EmptyState message={emptyMessage} onReset={onReset} />;
  }

  return (
    <div className="wallpaper-grid movie-grid">
      {movies.map((movie, idx) => (
        <MovieCard key={movie.id || movie.slug || idx} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
