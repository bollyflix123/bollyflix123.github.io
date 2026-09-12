import siteConfig from "../config/siteConfig";

/**
 * Dynamically set page document title, meta tags, and OpenGraph metadata
 */
export const setPageSEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "video.movie",
  jsonLd = null
}) => {
  // Title
  const pageTitle = title ? `${title} | ${siteConfig.SITE_NAME}` : siteConfig.DEFAULT_SEO_TITLE;
  document.title = pageTitle;

  // Description
  const pageDesc = description || siteConfig.DEFAULT_SEO_DESCRIPTION;
  setMetaTag("name", "description", pageDesc);
  setMetaTag("property", "og:description", pageDesc);
  setMetaTag("name", "twitter:description", pageDesc);

  // Keywords
  if (keywords) {
    setMetaTag("name", "keywords", keywords);
  } else {
    setMetaTag("name", "keywords", siteConfig.DEFAULT_META_KEYWORDS);
  }

  // OG Title & Twitter Title
  setMetaTag("property", "og:title", pageTitle);
  setMetaTag("name", "twitter:title", pageTitle);

  // OG Type & URL
  setMetaTag("property", "og:type", type);
  const currentUrl = url || window.location.href;
  setMetaTag("property", "og:url", currentUrl);
  setMetaTag("name", "twitter:url", currentUrl);

  // Canonical Link
  setCanonicalUrl(currentUrl);

  // OG Image & Twitter Image
  if (image) {
    setMetaTag("property", "og:image", image);
    setMetaTag("name", "twitter:image", image);
    setMetaTag("name", "twitter:card", "summary_large_image");
  } else {
    setMetaTag("name", "twitter:card", "summary");
  }

  // JSON-LD Structured Data
  if (jsonLd) {
    injectJsonLd(jsonLd);
  } else {
    removeJsonLd();
  }
};

const setMetaTag = (attribute, key, value) => {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", value);
};

const setCanonicalUrl = (url) => {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
};

export const injectJsonLd = (data) => {
  let script = document.getElementById("json-ld-schema");
  if (!script) {
    script = document.createElement("script");
    script.id = "json-ld-schema";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

const removeJsonLd = () => {
  const script = document.getElementById("json-ld-schema");
  if (script) {
    script.remove();
  }
};

/**
 * Generate Movie / VideoObject JSON-LD Schema for FilmyZilla
 */
export const generateMovieSchema = (movie) => {
  if (!movie) return null;
  return {
    "@context": "https://schema.org/",
    "@type": "Movie",
    "name": movie.title,
    "description": movie.description || movie.meta_description || movie.title,
    "image": movie.image_url,
    "dateCreated": movie.published_date || undefined,
    "genre": movie.tags ? movie.tags.split(",") : [movie.category],
    "trailer": movie.youtube_embed_url ? {
      "@type": "VideoObject",
      "name": `${movie.title} Official Trailer`,
      "description": movie.description || movie.title,
      "thumbnailUrl": movie.image_url,
      "embedUrl": movie.youtube_embed_url
    } : undefined
  };
};

export const generateWallpaperSchema = generateMovieSchema;

/**
 * Generate BreadcrumbList JSON-LD Schema
 */
export const generateBreadcrumbSchema = (items) => {
  if (!items || !items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url ? `${siteConfig.SITE_URL}${item.url}` : siteConfig.SITE_URL
    }))
  };
};
