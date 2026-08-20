import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Converts unknown axios/network errors into a single, user-friendly
 * Error object so components never need to deal with raw stack traces
 * or inconsistent error shapes.
 */
function normalizeError(error) {
  if (error.response) {
    // Server responded with an error status
    const detail = error.response.data?.detail;
    if (Array.isArray(detail)) {
      // FastAPI/Pydantic validation error array
      const messages = detail.map((d) => d.msg).join(" ");
      return new Error(messages || "Invalid input. Please check your entries.");
    }
    if (typeof detail === "string") {
      return new Error(detail);
    }
    return new Error("Something went wrong on the server. Please try again.");
  }

  if (error.request) {
    // Request was made but no response received
    return new Error(
      "Unable to connect to the prediction server. Please make sure the FastAPI backend is running."
    );
  }

  return new Error("An unexpected error occurred. Please try again.");
}

export async function predictPlacement(studentData) {
  try {
    const response = await apiClient.post("/api/predict", studentData);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function getDashboardStats() {
  try {
    const response = await apiClient.get("/api/dashboard/stats");
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function getDashboardAnalysis() {
  try {
    const response = await apiClient.get("/api/dashboard/analysis");
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function checkHealth() {
  try {
    const response = await apiClient.get("/api/health");
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export default apiClient;
