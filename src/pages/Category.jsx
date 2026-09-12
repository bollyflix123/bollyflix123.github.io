import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import WallpaperGrid from "../components/WallpaperGrid";
import Pagination from "../components/Pagination";
import Breadcrumb from "../components/Breadcrumb";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import { getWallpapersByCategory } from "../services/googleSheets";
import { setPageSEO } from "../utils/seo";
import siteConfig from "../config/siteConfig";
import { Folder } from "lucide-react";
import "./Pages.css";

export const Category = () => {
  const { category: catParam } = useParams();
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = siteConfig.ITEMS_PER_PAGE;

  const displayCatName = catParam
    ? catParam.charAt(0).toUpperCase() + catParam.slice(1).replace(/-/g, " ")
    : "Category";

  const loadCategoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWallpapersByCategory(catParam);
      setWallpapers(data);
    } catch (err) {
      console.error(err);
      setError(`Failed to load ${displayCatName} wallpapers.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (catParam) {
      loadCategoryData();
      setPageSEO({
        title: `${displayCatName} Wallpapers | ${siteConfig.SITE_NAME}`,
        description: `Download free 4K and Full HD ${displayCatName} wallpapers for desktop, iPhone, and Android.`
      });
    }
  }, [catParam]);

  const totalPages = Math.ceil(wallpapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentWallpapers = wallpapers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  const breadcrumbs = [
    { name: "Categories", url: "/categories" },
    { name: displayCatName, url: `/category/${catParam}` }
  ];

  return (
    <div className="category-page container page-padding">
      <Breadcrumb items={breadcrumbs} />

      <div className="page-header-bar">
        <div>
          <h1 className="page-main-title">
            {displayCatName} <span className="gradient-text">Wallpapers</span>
          </h1>
          <p className="page-sub-title">Showing {wallpapers.length} curated {displayCatName} backgrounds</p>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={12} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadCategoryData} />
      ) : (
        <>
          <WallpaperGrid
            wallpapers={currentWallpapers}
            emptyMessage={`No wallpapers found in the "${displayCatName}" category.`}
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

export default Category;
