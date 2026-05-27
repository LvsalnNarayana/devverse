/**
 * Fetch JSON served from Vite `public/` (paths like /configs/...).
 *
 * @param {string} path — e.g. /configs/dsa/topic-pages.json
 * @returns {Promise<unknown>}
 */
export async function loadPublicJson(path = '') {
  const cleaned = path.replace(/^\/+/, '');
  const fetchUrl = cleaned.startsWith('public/')
    ? `/${cleaned.slice('public/'.length)}`
    : `/${cleaned}`;

  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch JSON (${response.status}) from "${fetchUrl}".`);
  }
  const text = await response.text();
  if (!text.trim()) {
    return {};
  }
  return JSON.parse(text);
}
