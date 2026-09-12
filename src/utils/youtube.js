/**
 * Extract YouTube Video ID from any YouTube URL (watch, shorts, embed, timestamped, mobile)
 * @param {string} url
 * @returns {string|null}
 */
export const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const str = url.toString().trim();

  // Direct 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }

  // Robust YouTube URL regex matching standard, shorts, embed, live, and mobile links
  const regex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts|live)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = str.match(regex);

  if (match && match[1]) {
    return match[1];
  }

  return null;
};

/**
 * Generate clean responsive YouTube iFrame Embed URL
 * @param {string} urlOrId
 * @param {boolean} autoplay
 * @returns {string|null}
 */
export const getYouTubeEmbedUrl = (urlOrId, autoplay = true) => {
  const videoId = getYouTubeVideoId(urlOrId);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&enablejsapi=1`;
};

/**
 * Get high resolution YouTube video thumbnail URL
 * @param {string} urlOrId
 * @returns {string|null}
 */
export const getYouTubeThumbnailUrl = (urlOrId) => {
  const videoId = getYouTubeVideoId(urlOrId);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};
