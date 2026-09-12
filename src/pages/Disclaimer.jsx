import React, { useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { setPageSEO } from "../utils/seo";
import siteConfig from "../config/siteConfig";
import { HelpCircle } from "lucide-react";
import "./Pages.css";

export const Disclaimer = () => {
  useEffect(() => {
    setPageSEO({
      title: `Disclaimer | ${siteConfig.SITE_NAME}`,
      description: "Copyright and content ownership disclaimer for Wallify."
    });
  }, []);

  return (
    <div className="legal-page container page-padding">
      <Breadcrumb items={[{ name: "Disclaimer", url: "/disclaimer" }]} />
      
      <div className="legal-content-card glass-panel">
        <div className="legal-header">
          <HelpCircle size={32} color="#c084fc" />
          <h1 className="page-main-title">Disclaimer</h1>
          <p className="last-updated">Copyright & DMCA Information</p>
        </div>

        <div className="legal-body">
          <section>
            <h2>Copyright & Content Ownership</h2>
            <p>
              All wallpapers displayed on {siteConfig.SITE_NAME} are collected from public domain sources, free photography repositories (such as Unsplash, Pexels), or contributed by artists. Copyright belongs to their respective original creators.
            </p>
          </section>

          <section>
            <h2>Takedown Requests (DMCA)</h2>
            <p>
              If you are a copyright owner or an agent thereof and believe that any content hosted or linked on this site infringes upon your copyright, please contact us at <strong>{siteConfig.CONTACT_EMAIL}</strong> with the wallpaper title, URL, and proof of ownership. We will promptly remove the content within 24–48 hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
