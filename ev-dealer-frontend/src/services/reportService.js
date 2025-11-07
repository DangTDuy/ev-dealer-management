const BASE =
  import.meta.env.VITE_REPORTING_SERVICE_URL || "http://localhost:5006";

async function getJson(url) {
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}

export async function getSalesByRegion({ from, to } = {}) {
  const qs = new URLSearchParams();
  if (from) qs.set("from", from);
  if (to) qs.set("to", to);
  const url = `${BASE}/api/reports/sales-by-region${
    qs.toString() ? "?" + qs.toString() : ""
  }`;
  return getJson(url);
}

export async function getSummary({ from, to, type = "sales" } = {}) {
  const qs = new URLSearchParams();
  if (from) qs.set("from", from);
  if (to) qs.set("to", to);
  if (type) qs.set("type", type);
  const url = `${BASE}/api/reports/summary${
    qs.toString() ? "?" + qs.toString() : ""
  }`;
  return getJson(url);
}

export async function getTopVehicles({ from, to, limit = 5 } = {}) {
  const qs = new URLSearchParams();
  if (from) qs.set("from", from);
  if (to) qs.set("to", to);
  if (limit) qs.set("limit", limit.toString());
  const url = `${BASE}/api/reports/top-vehicles${
    qs.toString() ? "?" + qs.toString() : ""
  }`;
  return getJson(url);
}

export async function exportReport(payload = {}) {
  const url = `${BASE}/api/reports/export`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Export failed: ${res.status}`);
  const blob = await res.blob();
  return blob;
}

export default {
  getSalesByRegion,
  getSummary,
  getTopVehicles,
  exportReport,
};
