import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import { getCategories } from "../services/googleSheets";
import { setPageSEO } from "../utils/seo";
import siteConfig from "../config/siteConfig";
import { Layers, ArrowRight } from "lucide-react";
import "./Categories.css";

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCatData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load wallpaper categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatData();
    setPageSEO({
      title: `Wallpaper Categories | ${siteConfig.SITE_NAME}`,
      description: "Explore free HD & 4K wallpapers organized by categories including Nature, Anime, Cyberpunk, Cars, Space, and Minimal."
    });
  }, []);

  return (
    <div className="categories-page container page-padding">
      <Breadcrumb items={[{ name: "Categories", url: "/categories" }]} />

      <div className="page-header">
        <h1 className="page-main-title">
          Explore Wallpaper <span className="gradient-text">Categories</span>
        </h1>
        <p className="page-sub-title">Find wallpapers tailored to your aesthetic style</p>
      </div>

      {loading ? (
        <div className="category-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="cat-card-skeleton skeleton"></div>
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadCatData} />
      ) : (
        <div className="category-grid">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/category/${cat.slug}`}
              className="category-card glass-panel"
            >
              <div className="cat-card-cover">
                <img src={cat.cover_image} alt={`${cat.name} category`} loading="lazy" />
                <div className="cat-card-overlay"></div>
              </div>
              <div className="cat-card-content">
                <h3 className="cat-card-name">{cat.name}</h3>
                <span className="cat-card-count">{cat.count} Wallpapers</span>
                <span className="cat-card-link">
                  Browse <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
