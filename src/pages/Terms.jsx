import React, { useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { setPageSEO } from "../utils/seo";
import siteConfig from "../config/siteConfig";
import { FileText } from "lucide-react";
import "./Pages.css";

export const Terms = () => {
  useEffect(() => {
    setPageSEO({
      title: `Terms & Conditions | ${siteConfig.SITE_NAME}`,
      description: "Terms and conditions of use for downloading wallpapers on Wallify."
    });
  }, []);

  return (
    <div className="legal-page container page-padding">
      <Breadcrumb items={[{ name: "Terms & Conditions", url: "/terms" }]} />
      
      <div className="legal-content-card glass-panel">
        <div className="legal-header">
          <FileText size={32} color="#818cf8" />
          <h1 className="page-main-title">Terms & Conditions</h1>
          <p className="last-updated">Last Updated: September 12, 2026</p>
        </div>

        <div className="legal-body">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using {siteConfig.SITE_NAME}, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2>2. License & Personal Use</h2>
            <p>
              Wallpapers provided on {siteConfig.SITE_NAME} are intended for personal desktop, mobile, tablet, and smart device background customization. Reselling, redistributing, or claiming ownership of third-party copyrighted images without permission is strictly prohibited.
            </p>
          </section>

          <section>
            <h2>3. Disclaimer of Warranties</h2>
            <p>
              The website content is provided "as is" without warranty of any kind. We do not guarantee uninterrupted access or error-free availability of external wallpaper links.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
