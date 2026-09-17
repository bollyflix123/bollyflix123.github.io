import siteConfig from "../config/siteConfig.js";
import sampleMovies from "../data/sampleMovies.js";
import slugify from "../utils/slugify.js";
import { getYouTubeEmbedUrl, getYouTubeVideoId } from "../utils/youtube.js";

// In-memory cache
let cachedMovies = null;
const CACHE_KEY = "filmyzilla_movies_cache_v4";

/**
 * Clean & normalize Google Sheet row keys
 */
const normalizeKey = (key) => {
  if (!key) return "";
  return key
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
};

/**
 * Normalize single movie record from Google Sheets or sample data
 */
export const normalizeMovie = (rawItem, index) => {
  const item = {};

  Object.keys(rawItem).forEach((k) => {
    const normKey = normalizeKey(k);
    item[normKey] = rawItem[k] !== undefined && rawItem[k] !== null ? String(rawItem[k]).trim() : "";
  });

  const title = item.title || item.name || `Movie ${index + 1}`;
  const slug = item.slug || slugify(title) || `movie-${item.id || index + 1}`;

  // Extract YouTube trailer URL or ID
  const trailerRaw =
    item.trailer_url ||
    item.youtube_url ||
    item.trailer ||
    item.youtube ||
    item.youtube_link ||
    item.trailer_link ||
    "";
    
  const embedUrl = getYouTubeEmbedUrl(trailerRaw, false);
  const videoId = getYouTubeVideoId(trailerRaw);

  return {
    id: item.id || String(index + 1),
    title: title,
    slug: slug,
    image_url: item.image_url || item.poster || item.banner || item.image || item.url || "",
    download_url: item.download_url || item.stream_url || item.download || item.stream || item.link || "",
    trailer_url: trailerRaw,
    youtube_embed_url: embedUrl,
    youtube_id: videoId,
    description: item.description || item.synopsis || item.desc || "",
    category: item.category || item.type || item.format || "Movie",
    tags: item.tags || item.genre || item.genres || item.keywords || "Action",
    resolution: item.resolution || item.quality || "",
    file_type: item.file_type || item.language || item.audio || item.format || "Dual Audio",
    file_size: item.file_size || item.duration || item.runtime || item.size || "",
    author: item.author || item.director || item.rating || item.cast || "★ 8.5/10",
    published_date: item.published_date || item.year || item.release_year || item.date || "2026",
    featured: item.featured && (item.featured.toLowerCase() === "true" || item.featured === "1" || item.featured.toLowerCase() === "yes"),
    meta_title: item.meta_title || "",
    meta_description: item.meta_description || ""
  };
};

/**
 * Parse Google Sheets GViz Response format
 */
const parseGvizResponse = (text) => {
  try {
    const jsonString = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const data = JSON.parse(jsonString);
    const cols = data.table.cols.map((col) => col.label || col.id);

    return data.table.rows.map((row, idx) => {
      const rawObj = {};
      row.c.forEach((cell, i) => {
        const key = cols[i];
        rawObj[key] = cell && cell.v !== null && cell.v !== undefined ? cell.v : "";
      });
      return normalizeMovie(rawObj, idx);
    });
  } catch (err) {
    console.error("Error parsing GViz response:", err);
    return null;
  }
};

/**
 * Main function to fetch movies from Google Sheets (or sample fallback)
 */
export const fetchMovies = async (forceRefresh = false) => {
  if (!forceRefresh && cachedMovies && cachedMovies.length > 0) {
    return cachedMovies;
  }

  if (!forceRefresh) {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const stored = window.sessionStorage.getItem(CACHE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            cachedMovies = parsed;
            return cachedMovies;
          }
        }
      }
    } catch (e) {
      console.warn("sessionStorage read failed:", e);
    }
  }

  const apiUrl = siteConfig.GOOGLE_SHEET_API_URL?.trim();
  const gvizFallbackUrl = "https://docs.google.com/spreadsheets/d/1Lvs5rtT3qRZTeycPQemTcrC7snfpVZILojE8kD9HTUI/gviz/tq?tqx=out:json&sheet=FormData";

  const tryFetchFromUrl = async (url) => {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Accept": "application/json, text/plain, */*" }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const textData = await response.text();
    let rawList = [];

    if (textData.includes("google.visualization.Query.setResponse")) {
      rawList = parseGvizResponse(textData);
    } else {
      try {
        const parsedJson = JSON.parse(textData);
        if (Array.isArray(parsedJson)) {
          rawList = parsedJson;
        } else if (parsedJson && Array.isArray(parsedJson.data)) {
          rawList = parsedJson.data;
        } else if (parsedJson && Array.isArray(parsedJson.movies)) {
          rawList = parsedJson.movies;
        }
      } catch (err) {
        console.error("JSON parse error:", err);
      }
    }

    if (rawList && rawList.length > 0) {
      return rawList.map((item, idx) => normalizeMovie(item, idx));
    }
    throw new Error("No movie items found in sheet response.");
  };

  try {
    if (apiUrl) {
      const normalizedRemote = await tryFetchFromUrl(apiUrl);
      cachedMovies = normalizedRemote;
      try {
        if (typeof window !== "undefined" && window.sessionStorage) {
          window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(cachedMovies));
        }
      } catch (e) {
        console.warn("sessionStorage write failed:", e);
      }
      return cachedMovies;
    }
  } catch (error) {
    console.warn("Primary API URL fetch failed, trying GViz fallback...", error);
    try {
      const normalizedRemote = await tryFetchFromUrl(gvizFallbackUrl);
      cachedMovies = normalizedRemote;
      try {
        if (typeof window !== "undefined" && window.sessionStorage) {
          window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(cachedMovies));
        }
      } catch (e) {
        console.warn("sessionStorage write failed:", e);
      }
      return cachedMovies;
    } catch (fallbackErr) {
      console.warn("GViz fallback fetch failed as well.", fallbackErr);
    }
  }

  console.info("Serving sample movies as fallback.");
  const normalizedSamples = sampleMovies.map((item, idx) => normalizeMovie(item, idx));
  cachedMovies = normalizedSamples;
  return cachedMovies;
};

export const fetchWallpapers = fetchMovies;

export const getMovieBySlug = async (slug) => {
  const movies = await fetchMovies();
  const targetSlug = slugify(slug);
  return (
    movies.find((m) => m.slug === targetSlug || slugify(m.slug) === targetSlug || m.id === slug) || null
  );
};

export const getWallpaperBySlug = getMovieBySlug;

export const getGenres = async () => {
  const movies = await fetchMovies();
  const genreMap = {};

  movies.forEach((m) => {
    const genres = (m.tags || "Action")
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);

    genres.forEach((g) => {
      const normG = g.charAt(0).toUpperCase() + g.slice(1);
      if (!genreMap[normG]) {
        genreMap[normG] = {
          name: normG,
          count: 0,
          slug: slugify(normG),
          cover_image: m.image_url
        };
      }
      genreMap[normG].count += 1;
    });
  });

  return Object.values(genreMap).sort((a, b) => b.count - a.count);
};

export const getCategories = getGenres;

export const getMoviesByCategory = async (categoryName) => {
  const movies = await fetchMovies();
  const targetCatSlug = slugify(categoryName);

  return movies.filter(
    (m) => slugify(m.category) === targetCatSlug || m.category.toLowerCase() === categoryName.toLowerCase()
  );
};

export const getWallpapersByCategory = getMoviesByCategory;

export const getMoviesByGenre = async (genreName) => {
  const movies = await fetchMovies();
  const targetGenreSlug = slugify(genreName);

  return movies.filter((m) => {
    const genres = (m.tags || "").split(",").map((g) => slugify(g.trim()));
    return genres.includes(targetGenreSlug);
  });
};

export const searchMovies = async (query) => {
  const movies = await fetchMovies();
  if (!query || !query.trim()) return movies;

  const term = query.toLowerCase().trim();
  const words = term.split(/\s+/);

  return movies.filter((m) => {
    const titleMatch = m.title.toLowerCase().includes(term);
    const catMatch = m.category.toLowerCase().includes(term);
    const tagsMatch = m.tags.toLowerCase().includes(term);
    const descMatch = m.description.toLowerCase().includes(term);
    const authorMatch = m.author.toLowerCase().includes(term);

    if (titleMatch || catMatch || tagsMatch || descMatch || authorMatch) return true;

    return words.every(
      (word) =>
        m.title.toLowerCase().includes(word) ||
        m.category.toLowerCase().includes(word) ||
        m.tags.toLowerCase().includes(word)
    );
  });
};

export const searchWallpapers = searchMovies;

export const getFeaturedMovies = async (limit = siteConfig.FEATURED_LIMIT) => {
  const movies = await fetchMovies();
  const featured = movies.filter((m) => m.featured);
  if (featured.length > 0) return featured.slice(0, limit);
  return movies.slice(0, limit);
};

export const getFeaturedWallpapers = getFeaturedMovies;

export const getRelatedMovies = async (currentMovie, limit = siteConfig.RELATED_LIMIT) => {
  if (!currentMovie) return [];
  const movies = await fetchMovies();

  const currentGenres = (currentMovie.tags || "").toLowerCase().split(",").map((g) => g.trim());
  const others = movies.filter((m) => m.id !== currentMovie.id && m.slug !== currentMovie.slug);

  const scored = others.map((m) => {
    let score = 0;
    if (m.category.toLowerCase() === currentMovie.category.toLowerCase()) score += 5;

    const itemTags = (m.tags || "").toLowerCase();
    currentGenres.forEach((genre) => {
      if (itemTags.includes(genre)) score += 3;
    });

    return { movie: m, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.movie);
};

export const getRelatedWallpapers = getRelatedMovies;
