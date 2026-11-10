import { labelCategory } from "../constants/categories";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8080/api";
const backendOrigin = apiBaseUrl.replace(/\/api\/?$/, "");

const palettes = {
  MUSIC: ["#101828", "#ff6b5f", "#f5a524"],
  TECH: ["#102a43", "#13c6a3", "#60a5fa"],
  SPORTS: ["#10251c", "#22c55e", "#facc15"],
  EDUCATION: ["#251445", "#8b5cf6", "#38bdf8"],
  BUSINESS: ["#111827", "#64748b", "#f59e0b"],
  WORKSHOP: ["#2a1f12", "#f97316", "#fde68a"],
  FESTIVAL: ["#241124", "#ec4899", "#facc15"],
  FOOD: ["#2b1711", "#ef4444", "#fb923c"],
  ART: ["#1f1b4d", "#a855f7", "#f472b6"],
  NETWORKING: ["#0f172a", "#14b8a6", "#93c5fd"]
};

function isUsableImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  return trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/") || trimmed.startsWith("data:image/");
}

export function eventImage(event) {
  if (!isUsableImageUrl(event?.imageUrl)) return fallbackEventImage(event);
  const imageUrl = event.imageUrl.trim();
  if (imageUrl.startsWith("/uploads/")) return `${backendOrigin}${imageUrl}`;
  if (imageUrl.startsWith("uploads/")) return `${backendOrigin}/${imageUrl}`;
  return imageUrl;
}

export function fallbackEventImage(event) {
  const category = event?.category || "MUSIC";
  const [base, accent, glow] = palettes[category] || palettes.MUSIC;
  const title = event?.title || "EventPro";
  const categoryLabel = labelCategory(category);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="${escapeXml(title)}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${base}"/>
          <stop offset="0.52" stop-color="${accent}"/>
          <stop offset="1" stop-color="${glow}"/>
        </linearGradient>
        <radialGradient id="spot" cx="78%" cy="22%" r="55%">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.45"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#bg)"/>
      <rect width="1200" height="675" fill="url(#spot)"/>
      <circle cx="156" cy="148" r="74" fill="#ffffff" opacity="0.16"/>
      <circle cx="1040" cy="548" r="118" fill="#ffffff" opacity="0.12"/>
      <path d="M0 520 C210 452 334 612 558 548 C802 480 908 338 1200 412 L1200 675 L0 675 Z" fill="#ffffff" opacity="0.16"/>
      <text x="72" y="112" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="800" letter-spacing="5">${escapeXml(categoryLabel.toUpperCase())}</text>
      <text x="72" y="525" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="64" font-weight="900">${escapeXml(truncate(title, 28))}</text>
      <text x="76" y="582" fill="#ffffff" opacity="0.86" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="600">EventPro</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function truncate(value, length) {
  return value.length > length ? `${value.slice(0, length - 1)}...` : value;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");
}
