import axios from "axios";

// Create axios instance for ReportingService (different port)
const reportingApi = axios.create({
  baseURL: import.meta.env.VITE_REPORTING_SERVICE_URL || "http://localhost:5208/api/reports",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor - Handle errors
reportingApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      console.error("Reporting API Error:", data);
      return Promise.reject(data.message || data.error || "An error occurred");
    } else if (error.request) {
      return Promise.reject("Network error. Please check your connection.");
    } else {
      return Promise.reject(error.message);
    }
  }
);

export const reportService = {
  getSummary: async (params = {}) => {
    try {
      const { from, to, type = "sales" } = params;
      const queryParams = new URLSearchParams();
      if (from) queryParams.append("from", from);
      if (to) queryParams.append("to", to);
      if (type) queryParams.append("type", type);
      
      const url = `/summary${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
      const response = await reportingApi.get(url);
      return response.metrics || response;
    } catch (error) {
      console.error("Error fetching summary:", error);
      throw error;
    }
  },

  getSalesByRegion: async (params = {}) => {
    try {
      const { from, to } = params;
      const queryParams = new URLSearchParams();
      if (from) queryParams.append("from", from);
      if (to) queryParams.append("to", to);
      
      const url = `/sales-by-region${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
      const response = await reportingApi.get(url);
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.error("Error fetching sales by region:", error);
      throw error;
    }
  },

  getSalesProportion: async (params = {}) => {
    try {
      const { from, to } = params;
      const queryParams = new URLSearchParams();
      if (from) queryParams.append("from", from);
      if (to) queryParams.append("to", to);
      
      const url = `/sales-proportion${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
      const response = await reportingApi.get(url);
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.error("Error fetching sales proportion:", error);
      throw error;
    }
  },

  getTopVehicles: async (params = {}) => {
    try {
      const { from, to, limit = 5 } = params;
      const queryParams = new URLSearchParams();
      if (from) queryParams.append("from", from);
      if (to) queryParams.append("to", to);
      if (limit) queryParams.append("limit", limit.toString());
      
      const url = `/top-vehicles${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
      const response = await reportingApi.get(url);
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.error("Error fetching top vehicles:", error);
      throw error;
    }
  },

  exportReport: async (payload = {}) => {
    try {
      const response = await reportingApi.post("/export", payload, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      console.error("Error exporting report:", error);
      throw error;
    }
  },
};

export default reportService;
