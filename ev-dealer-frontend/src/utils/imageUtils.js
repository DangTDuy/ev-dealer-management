/**
 * Small helper to normalize image paths used across the app.
 * - If an image path is an absolute URL (http(s) or starts with '/') return as-is.
 * - Otherwise prefix with '/' so Vite serves local files consistently (e.g. 'src/assets/img/car1.png' -> '/src/assets/img/car1.png').
 */
export function resolveImagePath(path) {
  if (!path) return path
  const p = String(path)
  if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('/')) return p
  return `/${p}`
}

export default resolveImagePath
