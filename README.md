# Wallify 4K - React & Google Sheets Powered Wallpaper Downloading Website

A complete, modern, responsive, and SEO-friendly wallpaper downloading web application built using **React 18**, **React Router v6**, and **Google Sheets** as the backend CMS.

---

## 🌟 Key Features

- **No Traditional Backend Required**: Operates purely on frontend technology using Google Sheets as a lightweight CMS.
- **Dynamic Google Sheets CMS Sync**: Add or update wallpapers simply by modifying rows in your Google Sheet.
- **Dedicated Wallpaper Details Page (`/wallpaper/:slug`)**: SEO-friendly clean URLs with full specs, resolution badges, tags, preview zoom, and direct download links.
- **Card Download Behavior**: Clicking "Download Wallpaper" on wallpaper cards opens the wallpaper's details page first. The details page provides the direct download action.
- **Client-Side Shareable Pagination**: Shareable URLs (`/wallpapers?page=2`, `/category/nature?page=2`, `/search?q=car&page=2`).
- **Debounced Instant Search**: Search by title, category, description, author, or tags with shareable URLs (`/search?q=car`).
- **Category Browsing**: Visual categories page (`/categories`) and category detail filtering (`/category/:category`).
- **Related Wallpapers**: Smart recommendation engine showing 4–8 related wallpapers matching category and tags.
- **Complete SEO Engine**: Dynamic `<title>`, meta descriptions, OpenGraph, Twitter cards, canonical URLs, and `ImageObject` + `BreadcrumbList` JSON-LD structured data.
- **Fallback Sample Data**: Ships out-of-the-box with 24+ high-resolution sample wallpapers so the app works immediately.
- **Responsive Premium Dark Aesthetics**: Glassmorphic UI cards, subtle glowing accents, skeleton loaders, and responsive grid layouts (4 cols desktop, 2-3 cols tablet, 1-2 cols mobile).

---

## 📁 Google Sheet Structure

Create a Google Sheet with the exact column headers below (in row 1):

| id | title | slug | image_url | download_url | description | category | tags | resolution | file_type | file_size | author | published_date | featured | meta_title | meta_description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Celestial Milky Way | celestial-milky-way | https://images.unsplash.com/photo-1506744038136-46273834b3fb | https://images.unsplash.com/photo-1506744038136-46273834b3fb | Breathtaking galaxy over mountains | Space | Milky Way, Stars, Night | 3840x2160 | JPG | 4.8 MB | Elena Rostova | 2026-01-15 | TRUE | Celestial Milky Way 4K Wallpaper | Download free 4K celestial Milky Way wallpaper for desktop. |

### Column Field Descriptions
- `id`: Unique identifier (e.g. `1`, `2`, `3`).
- `title`: Wallpaper title (e.g., `Celestial Milky Way`).
- `slug`: URL slug (e.g., `celestial-milky-way`). *If empty, auto-generated from title.*
- `image_url`: High-resolution preview image link.
- `download_url`: Direct download link opened when user clicks Download on details page.
- `description`: Detailed wallpaper description.
- `category`: Category name (e.g., `Nature`, `Space`, `Anime`, `Cyberpunk`, `Cars`).
- `tags`: Comma-separated tags (e.g., `Stars, Galaxy, Night`).
- `resolution`: Dimensions (e.g., `3840x2160` or `1920x1080`).
- `file_type`: Format extension (e.g., `JPG`, `PNG`, `WEBP`).
- `file_size`: Size string (e.g., `4.8 MB`).
- `author`: Photographer or creator name.
- `published_date`: YYYY-MM-DD date string.
- `featured`: Set to `TRUE` or `1` to highlight on homepage.
- `meta_title`: Custom SEO title for details page.
- `meta_description`: Custom SEO meta description.

---

## ⚙️ Google Sheets Integration Setup

### Option 1: OpenSheet API (Recommended - Easiest & Fastest)
1. Create your Google Sheet with the required columns.
2. In Google Sheets, click **File** -> **Share** -> **Share with others**.
3. Set access to **"Anyone with the link can view"**.
4. Copy your Google Sheet ID from the browser URL:
   `https://docs.google.com/spreadsheets/d/`**`YOUR_SPREADSHEET_ID`**`/edit`
5. Your public API URL will be:
   `https://opensheet.elk.sh/YOUR_SPREADSHEET_ID/Sheet1` (replace `Sheet1` with your sheet tab name).
6. Paste this URL into `src/config/siteConfig.js`:
   ```javascript
   export const siteConfig = {
     GOOGLE_SHEET_API_URL: "https://opensheet.elk.sh/YOUR_SPREADSHEET_ID/Sheet1",
     // ...
   };
   ```

### Option 2: Google Sheets GViz Endpoint
1. Share your Google Sheet as **"Anyone with link can view"**.
2. Set your API URL in `src/config/siteConfig.js`:
   `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/gviz/tq?tqx=out:json`

---

## 🛠️ Installation & Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🚀 Static Deployment Guide

Because the app is a pure React Single Page Application (SPA), you can deploy it to any static web hosting provider for free:

### 1. Vercel
- Import your repository on Vercel.
- Framework Preset: **Vite**.
- Build Command: `npm run build`.
- Output Directory: `dist`.

### 2. Netlify
- Build Command: `npm run build`.
- Publish Directory: `dist`.
- Include a `_redirects` file in `public/` containing: `/* /index.html 200` to support client-side React Router navigation.

### 3. GitHub Pages
- Use `gh-pages` npm package or GitHub Actions to deploy the contents of the `dist/` folder.

---

## 🗺️ Sitemap & Dynamic SEO Note

As a pure client-side SPA fetching dynamic data directly from Google Sheets at runtime in the browser, static sitemap generators cannot pre-render every dynamic wallpaper route (`/wallpaper/:slug`) during build time unless a prerendering step (like SSG or a GitHub Action build script) is used.

**Recommended Solution**:
1. Base sitemap file is located at `public/sitemap.xml`.
2. For indexing all dynamic wallpaper URLs, run a periodic node script or GitHub Action that reads your Google Sheet API and overwrites `public/sitemap.xml` before running `npm run build`.

---

## 📄 License & Attribution

Powered by React.js, React Router DOM, Lucide Icons, and Google Sheets API.
