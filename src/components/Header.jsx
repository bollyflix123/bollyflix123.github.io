import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Film, Play, Search, Menu, X, Flame } from "lucide-react";
import siteConfig from "../config/siteConfig";
import "./Header.css";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header className={`site-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container header-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" aria-label="FilmyZilla Home">
          <div className="logo-icon logo-red">
            <Film size={20} color="#e50914" />
            <Play size={10} className="logo-play" fill="#e50914" color="#e50914" />
          </div>
          <span className="logo-text">
            Filmy<span className="logo-highlight">Zilla</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>
          <NavLink to="/movies" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Movies & Series
          </NavLink>
          <NavLink to="/genres" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Genres
          </NavLink>
          <NavLink to="/category/web-series" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Web Series
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          <button
            className="search-shortcut-btn"
            onClick={() => navigate("/search")}
            aria-label="Search movies"
          >
            <Search size={18} />
            <span className="search-placeholder">Search movies, series, cast...</span>
            <kbd className="search-kbd">⌘K</kbd>
          </button>

          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? "open" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <div className="brand-logo">
              <Film size={22} color="#e50914" />
              <span className="logo-text">Filmy<span className="logo-highlight">Zilla</span></span>
            </div>
            <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>

          <nav className="mobile-nav-links">
            <NavLink to="/" className="mobile-nav-item">
              Home
            </NavLink>
            <NavLink to="/movies" className="mobile-nav-item">
              Movies & Web Series
            </NavLink>
            <NavLink to="/genres" className="mobile-nav-item">
              Genres
            </NavLink>
            <NavLink to="/category/web-series" className="mobile-nav-item">
              Web Series
            </NavLink>
            <NavLink to="/search" className="mobile-nav-item">
              Search FilmyZilla
            </NavLink>
          </nav>

          <div className="mobile-menu-footer">
            <p className="mobile-footer-text">{siteConfig.DEFAULT_SEO_DESCRIPTION}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
