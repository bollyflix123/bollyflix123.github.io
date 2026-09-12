import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { setPageSEO } from "../utils/seo";
import siteConfig from "../config/siteConfig";
import { Home, Compass } from "lucide-react";
import "./Pages.css";

export const NotFound = () => {
  useEffect(() => {
    setPageSEO({
      title: `404 - Page Not Found | ${siteConfig.SITE_NAME}`,
      description: "The page you are looking for does not exist."
    });
  }, []);

  return (
    <div className="notfound-page container page-padding">
      <div className="notfound-card glass-panel">
        <span className="notfound-code">404</span>
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-text">
          Oops! The wallpaper or page you are searching for might have been moved or deleted.
        </p>
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
          <Link to="/wallpapers" className="btn btn-secondary">
            <Compass size={18} />
            <span>Explore Library</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
