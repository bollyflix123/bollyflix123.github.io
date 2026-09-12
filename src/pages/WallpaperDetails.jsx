import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import WallpaperGrid from "../components/WallpaperGrid";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import { getWallpaperBySlug, getRelatedWallpapers } from "../services/googleSheets";
import { setPageSEO, generateWallpaperSchema, generateBreadcrumbSchema } from "../utils/seo";
import siteConfig from "../config/siteConfig";
import {
  Download,
  Monitor,
  HardDrive,
  FileCode,
  User,
  Calendar,
  Tag,
  Share2,
  Maximize2,
  ExternalLink,
  Check,
  AlertCircle,
  Folder
} from "lucide-react";
import "./WallpaperDetails.css";

export const WallpaperDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [wallpaper, setWallpaper] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const item = await getWallpaperBySlug(slug);
        if (!item) {
          setError("Wallpaper not found.");
          setLoading(false);
          return;
        }

        setWallpaper(item);

        // Fetch related wallpapers
        const relatedItems = await getRelatedWallpapers(item, 6);
        setRelated(relatedItems);

        // Set Dynamic SEO
        const seoTitle = item.meta_title || `${item.title} 4K Wallpaper`;
        const seoDesc =
          item.meta_description ||
          item.description ||
          `Download ${item.title} wallpaper in high resolution ${item.resolution || "4K"} for desktop and mobile.`;

        const breadcrumbs = [
          { name: "Wallpapers", url: "/wallpapers" },
          { name: item.category, url: `/category/${item.category.toLowerCase()}` },
          { name: item.title, url: `/wallpaper/${item.slug}` }
        ];

        setPageSEO({
          title: seoTitle,
          description: seoDesc,
          keywords: item.tags,
          image: item.image_url,
          url: window.location.href,
          type: "article",
          jsonLd: [
            generateWallpaperSchema(item),
            generateBreadcrumbSchema(breadcrumbs)
          ]
        });
      } catch (err) {
        console.error("Error loading wallpaper details:", err);
        setError("Unable to load wallpaper details.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadDetails();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [slug]);

  // Download Handler
  const handleDownload = () => {
    if (!wallpaper) return;
    const targetUrl = wallpaper.download_url || wallpaper.image_url;

    if (!targetUrl) {
      alert("Download URL is currently unavailable for this wallpaper.");
      return;
    }

    // Open target URL securely in new tab
    const anchor = document.createElement("a");
    anchor.href = targetUrl;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.setAttribute("download", `${wallpaper.slug || "wallpaper"}.jpg`);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  // Copy share link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="container page-padding">
        <LoadingSkeleton type="details" />
      </div>
    );
  }

  if (error || !wallpaper) {
    return (
      <div className="container page-padding">
        <ErrorState
          message={error || "Wallpaper not found."}
          onRetry={() => navigate("/wallpapers")}
        />
      </div>
    );
  }

  const tagsList = (wallpaper.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const breadcrumbs = [
    { name: "Wallpapers", url: "/wallpapers" },
    { name: wallpaper.category, url: `/category/${wallpaper.category.toLowerCase()}` },
    { name: wallpaper.title, url: `/wallpaper/${wallpaper.slug}` }
  ];

  return (
    <article className="wallpaper-details-page container page-padding">
      <Breadcrumb items={breadcrumbs} />

      {/* Main Details Grid */}
      <div className="details-layout glass-panel">
        
        {/* Left Column: Image Preview */}
        <div className="details-preview-column">
          <div className="preview-container">
            <img
              src={wallpaper.image_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809"}
              alt={wallpaper.title}
              className="preview-image"
            />
            <button
              className="zoom-toggle-btn"
              onClick={() => setIsZoomed(true)}
              aria-label="View fullscreen preview"
              title="Fullscreen Preview"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>

        {/* Right Column: Meta Specifications & Actions */}
        <div className="details-info-column">
          
          <div className="details-header">
            <div className="category-pill-wrap">
              <Link to={`/category/${wallpaper.category.toLowerCase()}`} className="badge badge-cyan">
                <Folder size={12} /> {wallpaper.category}
              </Link>
              {wallpaper.resolution && (
                <span className="badge badge-dark">
                  <Monitor size={12} /> {wallpaper.resolution}
                </span>
              )}
            </div>

            <h1 className="details-title">{wallpaper.title}</h1>
          </div>

          {/* Description */}
          {wallpaper.description && (
            <p className="details-description">{wallpaper.description}</p>
          )}

          {/* Technical Metadata Matrix */}
          <div className="specs-matrix">
            <h3 className="specs-heading">File Information</h3>
            <div className="specs-grid">
              {wallpaper.resolution && (
                <div className="spec-item">
                  <div className="spec-icon"><Monitor size={16} color="#38bdf8" /></div>
                  <div className="spec-content">
                    <span className="spec-label">Resolution</span>
                    <span className="spec-value">{wallpaper.resolution}</span>
                  </div>
                </div>
              )}

              {wallpaper.file_type && (
                <div className="spec-item">
                  <div className="spec-icon"><FileCode size={16} color="#818cf8" /></div>
                  <div className="spec-content">
                    <span className="spec-label">Format</span>
                    <span className="spec-value">{wallpaper.file_type.toUpperCase()}</span>
                  </div>
                </div>
              )}

              {wallpaper.file_size && (
                <div className="spec-item">
                  <div className="spec-icon"><HardDrive size={16} color="#c084fc" /></div>
                  <div className="spec-content">
                    <span className="spec-label">File Size</span>
                    <span className="spec-value">{wallpaper.file_size}</span>
                  </div>
                </div>
              )}

              {wallpaper.author && (
                <div className="spec-item">
                  <div className="spec-icon"><User size={16} color="#ec4899" /></div>
                  <div className="spec-content">
                    <span className="spec-label">Author</span>
                    <span className="spec-value">{wallpaper.author}</span>
                  </div>
                </div>
              )}

              {wallpaper.published_date && (
                <div className="spec-item">
                  <div className="spec-icon"><Calendar size={16} color="#10b981" /></div>
                  <div className="spec-content">
                    <span className="spec-label">Published</span>
                    <span className="spec-value">{wallpaper.published_date}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {tagsList.length > 0 && (
            <div className="details-tags-section">
              <h4 className="tags-heading"><Tag size={14} /> Tags</h4>
              <div className="tags-chips">
                {tagsList.map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?q=${encodeURIComponent(tag)}`}
                    className="tag-chip"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="details-actions">
            <button
              className="btn btn-primary download-primary-btn"
              onClick={handleDownload}

            >
              <Download size={20} />
              <span>Download Wallpaper</span>
              <ExternalLink size={16} className="ext-icon" />
            </button>

            <button
              className="btn btn-secondary share-btn"
              onClick={handleShare}
              title="Share Wallpaper"
            >
              {copied ? <Check size={18} color="#10b981" /> : <Share2 size={18} />}
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>
          </div>

          {/* Download Note */}
          <p className="download-disclaimer">
            <AlertCircle size={14} /> Free for personal desktop, mobile and background use.
          </p>

        </div>

      </div>

      {/* Lightbox Fullscreen Modal */}
      {isZoomed && (
        <div className="lightbox-modal" onClick={() => setIsZoomed(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={wallpaper.image_url} alt={wallpaper.title} className="lightbox-image" />
            <button className="lightbox-close" onClick={() => setIsZoomed(false)}>
              Close Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Related Wallpapers Section */}
      {related.length > 0 && (
        <section className="related-section">
          <div className="section-header">
            <h2 className="section-title">Related Wallpapers</h2>
            <span className="section-subtitle">More from {wallpaper.category} and similar tags</span>
          </div>
          <WallpaperGrid wallpapers={related} />
        </section>
      )}

    </article>
  );
};

export default WallpaperDetails;
