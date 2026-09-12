import React from "react";
import { Link } from "react-router-dom";
import { Film, Shield, FileText, HelpCircle, Mail } from "lucide-react";
import siteConfig from "../config/siteConfig";
import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <Link to="/" className="brand-logo footer-logo">
            <div className="logo-icon logo-red">
              <Film size={20} color="#e50914" />
            </div>
            <span className="logo-text">Filmy<span className="logo-highlight">Zilla</span></span>
          </Link>
          <p className="footer-desc">{siteConfig.DEFAULT_SEO_DESCRIPTION}</p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-title">Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/movies">Movies & Web Series</Link></li>
            <li><Link to="/genres">Genres Catalog</Link></li>
            <li><Link to="/category/web-series">Web Series</Link></li>
            <li><Link to="/search">Search Movies</Link></li>
          </ul>
        </div>

        {/* Popular Genres */}
        <div className="footer-col">
          <h4 className="footer-title">Top Genres</h4>
          <ul className="footer-links">
            {siteConfig.POPULAR_GENRES.slice(0, 5).map((genre) => (
              <li key={genre.name}>
                <Link to={`/genre/${genre.name.toLowerCase()}`}>{genre.name} Movies</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal & DMCA */}
        <div className="footer-col">
          <h4 className="footer-title">Legal & Support</h4>
          <ul className="footer-links">
            <li><Link to="/privacy-policy"><Shield size={14} /> Privacy Policy</Link></li>
            <li><Link to="/terms"><FileText size={14} /> Terms & Conditions</Link></li>
            <li><Link to="/disclaimer"><HelpCircle size={14} /> DMCA Disclaimer</Link></li>
            <li><Link to="/contact"><Mail size={14} /> Contact Us</Link></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="container bottom-container">
          <p>{siteConfig.FOOTER_TEXT}</p>
          <p className="made-with">
            FilmyZilla • HD Video Trailers & Stream Downloads
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
