/**
 * Convert string to a clean, URL-safe slug
 * @param {string} text
 * @returns {string}
 */
export const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W_]+|-+/g, "-") // Replace spaces, underscores, and non-word chars with -
    .replace(/^-+|-+$/g, "");     // Remove leading/trailing -
};

export default slugify;
