import express from "express";
import {
  assembleHomePayload,
  getDramaById,
  getEpisode,
  listDramas,
  searchDramas,
} from "../services/dramaService.js";
import { dramaDashClient } from "../services/dramaDashClient.js";
import { getWatchlist, toggleWatchlist } from "../services/watchlistService.js";
import { withCache } from "../utils/cache.js";

const router = express.Router();

router.get(
  "/home",
  withCache(() => "home_v2", 180),
  async (_req, res) => {
    try {
      console.log("Fetching home payload...");
      const payload = await dramaDashClient.getHomePayload();
      console.log("Home payload fetched. Sections:", payload.sections?.length);
      if (!payload.sections || payload.sections.length === 0) {
          console.warn("Home payload sections empty, falling back.");
          throw new Error("Empty home payload");
      }
      return res.json(payload);
    } catch (error) {
      console.warn("Falling back to static home payload", error.message);
      const fallback = assembleHomePayload();
      console.log("Fallback payload assembled. Sections:", fallback.sections?.length);
      return res.json(fallback);
    }
  }
);

router.get(
  "/dramas",
  withCache((req) =>
    `dramas:${req.query.tag ?? "-"}:${req.query.genre ?? "-"}:${req.query.sort ?? "-"}`
  ),
  async (req, res) => {
    const { tag, genre, sort, limit } = req.query;
    try {
      const items = await dramaDashClient.listDramas({ tag, genre, sort, limit });
      return res.json({ items });
    } catch (error) {
      console.warn("Falling back to static drama listing", error.message);
      const data = listDramas({ tag, genre, sort, limit });
      return res.json({ items: data });
    }
  }
);

router.get(
  "/dramas/:id",
  withCache((req) => `drama:${req.params.id}`),
  async (req, res) => {
    try {
      const detail = await dramaDashClient.getDrama(req.params.id);
      return res.json(detail);
    } catch (error) {
      const drama = getDramaById(req.params.id);
      if (!drama) return res.status(404).json({ message: "Drama not found" });
      return res.json({ drama, episodes: drama.episodes });
    }
  }
);

router.get(
  "/dramas/:id/episodes",
  withCache((req) => `episodes:${req.params.id}`),
  async (req, res) => {
    try {
      const detail = await dramaDashClient.getDrama(req.params.id);
      return res.json({ episodes: detail.episodes });
    } catch (error) {
      const drama = getDramaById(req.params.id);
      if (!drama) return res.status(404).json({ message: "Drama not found" });
      return res.json({ episodes: drama.episodes });
    }
  }
);

router.get("/dramas/:id/stream/:episodeId", async (req, res) => {
  try {
    const payload = await dramaDashClient.getEpisode(req.params.id, req.params.episodeId);
    return res.json(payload);
  } catch (error) {
    const payload = getEpisode(req.params.id, req.params.episodeId);
    if (!payload) return res.status(404).json({ message: "Stream not found" });
    return res.json(payload);
  }
});

router.get(
  "/search",
  withCache((req) => `search:${req.query.query ?? ""}`, 30),
  async (req, res) => {
    try {
      const items = await dramaDashClient.search(req.query.query ?? "");
      return res.json({ items });
    } catch (error) {
      const fallback = searchDramas(req.query.query ?? "");
      return res.json({ items: fallback });
    }
  }
);

router.get("/watchlist", (req, res) => {
  const deviceId = req.headers["x-device-id"] || req.query.deviceId;
  if (!deviceId) return res.status(400).json({ message: "Missing device id" });
  res.json({ items: getWatchlist(deviceId) });
});

router.post("/watchlist", async (req, res) => {
  const deviceId = req.headers["x-device-id"] || req.body.deviceId;
  if (!deviceId) return res.status(400).json({ message: "Missing device id" });
  try {
    const detail = await dramaDashClient.getDrama(req.body.dramaId);
    const items = toggleWatchlist(deviceId, {
      id: detail.drama.id,
      title: detail.drama.title,
      poster: detail.drama.poster,
      genres: detail.drama.genres,
    });
    return res.json({ items });
  } catch (error) {
    const drama = getDramaById(req.body.dramaId);
    if (!drama) return res.status(404).json({ message: "Drama not found" });
    const items = toggleWatchlist(deviceId, drama);
    return res.json({ items });
  }
});

export default router;
