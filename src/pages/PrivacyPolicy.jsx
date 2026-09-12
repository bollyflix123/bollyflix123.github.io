import React, { useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { setPageSEO } from "../utils/seo";
import siteConfig from "../config/siteConfig";
import { Shield } from "lucide-react";
import "./Pages.css";

export const PrivacyPolicy = () => {
  useEffect(() => {
    setPageSEO({
      title: `Privacy Policy | ${siteConfig.SITE_NAME}`,
      description: "Read our privacy policy regarding data protection, cookies, and user privacy."
    });
  }, []);

  return (
    <div className="legal-page container page-padding">
      <Breadcrumb items={[{ name: "Privacy Policy", url: "/privacy-policy" }]} />
      
      <div className="legal-content-card glass-panel">
        <div className="legal-header">
          <Shield size={32} color="#38bdf8" />
          <h1 className="page-main-title">Privacy Policy</h1>
          <p className="last-updated">Last Updated: September 12, 2026</p>
        </div>

        <div className="legal-body">
          <section>
            <h2>1. Information We Collect</h2>
            <p>
              At {siteConfig.SITE_NAME}, we value your privacy. We do not require account registration or collect personal identifying information (PII) to browse or download wallpapers. Standard server access logs and anonymous analytics may record IP addresses, browser types, and referral sources to optimize website performance.
            </p>
          </section>

          <section>
            <h2>2. Cookies & Local Storage</h2>
            <p>
              We use lightweight browser session storage solely to cache Google Sheets wallpaper data for fast navigation. We do not use persistent tracking cookies or third-party tracking pixels.
            </p>
          </section>

          <section>
            <h2>3. External Links & Media</h2>
            <p>
              Our wallpaper downloading service displays content linked from external image hosting endpoints (such as Google Sheets, Unsplash, and CDNs). When you click to download a file, you may be redirected to the direct image host. We encourage you to review the privacy policies of external sites.
            </p>
          </section>

          <section>
            <h2>4. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, please contact us at: <strong>{siteConfig.CONTACT_EMAIL}</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
