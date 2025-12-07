import axios from "axios";
import Constants from "expo-constants";
import { getDeviceId } from "../utils/deviceId.js";

const fallbackBaseUrl = "http://10.0.2.2:4000/api";

const baseURL =
  Constants?.expoConfig?.extra?.apiUrl ??
  Constants?.manifest?.extra?.apiUrl ??
  fallbackBaseUrl;

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const deviceId = await getDeviceId();
  if (deviceId) {
    config.headers["x-device-id"] = deviceId;
  }
  return config;
});

export const Api = {
  getHome: () => apiClient.get("/home").then((res) => res.data),
  listDramas: (params) => apiClient.get("/dramas", { params }).then((res) => res.data),
  getDrama: (id) => apiClient.get(`/dramas/${id}`).then((res) => res.data),
  getEpisodes: (id) => apiClient.get(`/dramas/${id}/episodes`).then((res) => res.data),
  getStream: ({ dramaId, episodeId }) =>
    apiClient.get(`/dramas/${dramaId}/stream/${episodeId}`).then((res) => res.data),
  search: (query) => apiClient.get("/search", { params: { query } }).then((res) => res.data),
  getWatchlist: () => apiClient.get("/watchlist").then((res) => res.data),
  toggleWatchlist: (dramaId) =>
    apiClient.post("/watchlist", { dramaId }).then((res) => res.data),
};
