/**
 * FilmyZilla Configuration
 */

export const siteConfig = {
  // Live Google Sheet API endpoint (OpenSheet format)
  GOOGLE_SHEET_API_URL: "https://opensheet.elk.sh/1Lvs5rtT3qRZTeycPQemTcrC7snfpVZILojE8kD9HTUI/Sheet1",

  // Website details
  SITE_NAME: "FilmyZilla",
  SITE_TAGLINE: "Watch & Download HD Movies & Web Series",
  SITE_URL: "https://filmyzilla.example.com",

  // Default SEO Metadata
  DEFAULT_SEO_TITLE: "FilmyZilla | Watch & Download 4K Movies, Web Series & Trailers",
  DEFAULT_SEO_DESCRIPTION: "Download and stream the latest 4K Ultra HD & 1080p Movies, Web Series, and HD Video Trailers for free on FilmyZilla.",
  DEFAULT_META_KEYWORDS: "filmyzilla, movies download, web series stream, 4k movies, hd trailers, action movies, sci-fi series, dual audio movies",

  // Pagination & Display Settings
  ITEMS_PER_PAGE: 12,
  FEATURED_LIMIT: 6,
  RELATED_LIMIT: 6,

  // Popular Genres & Formats
  POPULAR_GENRES: [
    { name: "Action", icon: "Swords", color: "#ef4444" },
    { name: "Sci-Fi", icon: "Rocket", color: "#38bdf8" },
    { name: "Drama", icon: "Film", color: "#f59e0b" },
    { name: "Thriller", icon: "Zap", color: "#8b5cf6" },
    { name: "Comedy", icon: "Smile", color: "#10b981" },
    { name: "Horror", icon: "Ghost", color: "#ec4899" },
    { name: "Romance", icon: "Heart", color: "#f43f5e" },
    { name: "Anime", icon: "Sparkles", color: "#00f2fe" },
    { name: "Adventure", icon: "Compass", color: "#14b8a6" },
    { name: "Fantasy", icon: "Wand2", color: "#c084fc" }
  ],

  // Footer & Contact Info
  FOOTER_TEXT: "© 2026 FilmyZilla. All rights reserved.",
  CONTACT_EMAIL: "support@filmyzilla.com"
};

export default siteConfig;
