import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import WallpaperGrid from "../components/WallpaperGrid";
import Pagination from "../components/Pagination";
import Breadcrumb from "../components/Breadcrumb";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import { fetchWallpapers, getCategories } from "../services/googleSheets";
import { setPageSEO } from "../utils/seo";
import siteConfig from "../config/siteConfig";
import { Image, Filter } from "lucide-react";
import "./Pages.css";

export const Wallpapers = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = siteConfig.ITEMS_PER_PAGE;

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allData, catData] = await Promise.all([
        fetchWallpapers(),
        getCategories()
      ]);
      setWallpapers(allData);
      setCategories(catData);
    } catch (err) {
      console.error(err);
      setError("Failed to load wallpaper library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setPageSEO({
      title: "All Wallpapers Collection",
      description: "Browse our complete catalog of HD, 4K, and Ultra HD desktop wallpapers."
    });
  }, []);

  const filteredWallpapers = selectedCat === "all"
    ? wallpapers
    : wallpapers.filter((w) => w.category.toLowerCase() === selectedCat.toLowerCase());

  const totalPages = Math.ceil(filteredWallpapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentWallpapers = filteredWallpapers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    const params = { page: page.toString() };
    if (selectedCat !== "all") params.category = selectedCat;
    setSearchParams(params);
  };

  const handleCategoryFilter = (cat) => {
    setSelectedCat(cat);
    setSearchParams({ page: "1" });
  };

  return (
    <div className="wallpapers-page container page-padding">
      <Breadcrumb items={[{ name: "Wallpapers", url: "/wallpapers" }]} />

      <div className="page-header-bar">
        <div>
          <h1 className="page-main-title">
            All <span className="gradient-text">Wallpapers</span>
          </h1>
          <p className="page-sub-title">Explore over {wallpapers.length} high-resolution wallpapers</p>
        </div>

        {/* Filter Dropdown */}
        <div className="filter-wrapper">
          <Filter size={16} color="#38bdf8" />
          <select
            className="category-select"
            value={selectedCat}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            aria-label="Filter by Category"
          >
            <option value="all">All Categories ({wallpapers.length})</option>
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={12} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <>
          <WallpaperGrid
            wallpapers={currentWallpapers}
            emptyMessage="No wallpapers found matching the selected category filter."
            onReset={() => handleCategoryFilter("all")}
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

export default Wallpapers;
