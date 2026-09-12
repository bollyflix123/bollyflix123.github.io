import React, { useState, useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { setPageSEO } from "../utils/seo";
import siteConfig from "../config/siteConfig";
import { Mail, Send, CheckCircle } from "lucide-react";
import "./Pages.css";

export const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setPageSEO({
      title: `Contact Us | ${siteConfig.SITE_NAME}`,
      description: "Get in touch with the Wallify team for feedback, copyright inquiries, or wallpaper requests."
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="contact-page container page-padding">
      <Breadcrumb items={[{ name: "Contact", url: "/contact" }]} />
      
      <div className="contact-card glass-panel">
        <div className="legal-header">
          <Mail size={32} color="#ec4899" />
          <h1 className="page-main-title">Contact <span className="gradient-text">Us</span></h1>
          <p className="page-sub-title">Have questions, feedback, or DMCA requests? Send us a message!</p>
        </div>

        {submitted ? (
          <div className="contact-success-state">
            <CheckCircle size={48} color="#10b981" />
            <h2>Thank You!</h2>
            <p>Your message has been sent successfully. We will get back to you shortly at {formData.email}.</p>
            <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
              Send Another Message
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Your Email *</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                placeholder="Wallpaper request / Copyright / General Feedback"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                rows={5}
                required
                placeholder="Write your message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary contact-submit-btn">
              <Send size={16} />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
