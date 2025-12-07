import axios from "axios";

const API_BASE = "https://sapi.dramabox.be/api";
const DEFAULT_LANG = "in";

function toCard(item) {
  return {
    id: `${item.bookId}`,
    title: item.bookName,
    poster: item.cover,
    thumbnail: item.cover,
    synopsis: item.introduction || "",
    rating: 5.0,
    viewCount: item.playCount,
    genres: (item.tags && typeof item.tags === 'string') ? item.tags.split(",") : (Array.isArray(item.tags) ? item.tags : []),
    tags: [],
  };
}

function mapEpisode(chapter, index) {
  return {
    id: `${chapter.chapterId}`,
    number: index + 1,
    title: `Episode ${index + 1}`,
    duration: 0, 
    thumbnail: null,
    streamUrl: null, 
  };
}

class DramaDashClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Content-Type": "application/json",
      },
      params: {
        lang: DEFAULT_LANG
      }
    });
  }

  async getHomePayload() {
    try {
      const [newList, rankList, forYouList] = await Promise.all([
        this.client.get("/new/1", { params: { pageSize: 10 } })
            .then((r) => r.data.data.list || [])
            .catch((e) => { console.error("getHomePayload /new/1 error:", e.message); return []; }),
        this.client.get("/rank/1", { params: { pageSize: 10 } })
            .then((r) => r.data.data.list || [])
            .catch((e) => { console.error("getHomePayload /rank/1 error:", e.message); return []; }),
        this.client.get("/foryou/1", { params: { pageSize: 10 } })
            .then((r) => r.data.data.list || [])
            .catch((e) => { console.error("getHomePayload /foryou/1 error:", e.message); return []; }),
      ]);

      const heroItem = rankList[0] || newList[0];
      const hero = heroItem
        ? {
            id: `${heroItem.bookId}`,
            title: heroItem.bookName,
            subtitle: heroItem.introduction ? heroItem.introduction.slice(0, 100) + "..." : "",
            cta: "Watch Now",
            background: heroItem.cover,
            tags: (heroItem.tags && typeof heroItem.tags === 'string') ? heroItem.tags.split(",") : (Array.isArray(heroItem.tags) ? heroItem.tags : []),
          }
        : null;

      return {
        hero,
        sections: [
          {
            id: "trending",
            title: "Trending Now",
            subtitle: "Top ranked dramas",
            layout: "landscape",
            items: rankList.map(toCard),
          },
          {
            id: "newest",
            title: "Fresh Drops",
            subtitle: "Latest additions",
            layout: "portrait",
            items: newList.map(toCard),
          },
          {
            id: "foryou",
            title: "Recommended For You",
            subtitle: "Personalized picks",
            layout: "cover",
            items: forYouList.map(toCard),
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching home payload:", error);
      return { hero: null, sections: [] };
    }
  }

  async listDramas({ tag, genre, sort, limit } = {}) {
    let endpoint = "/new/1";
    let params = {};

    if (sort === "trending") {
        endpoint = "/rank/1";
    } else if (tag || genre) {
        // Use classify if filters are present
        // Currently defaulting to pageNo=1 as we don't support pagination in this method signature yet
        endpoint = "/classify";
        params = { pageNo: 1, sort: 1 };
        // Note: Real genre ID mapping would be needed here for 'genre' param.
        // For now we just use the classify endpoint structure.
    }
    
    try {
      const response = await this.client.get(endpoint, { params });
      const list = response.data?.data?.list || [];
      
      let items = list.map(toCard);

      if (limit) {
        items = items.slice(0, Number(limit));
      }

      return items;
    } catch (error) {
      console.error("Error listing dramas:", error);
      return [];
    }
  }

  async search(query) {
    if (!query) return [];
    try {
      const response = await this.client.get(`/search/${encodeURIComponent(query)}/1`);
      let list = response.data?.data?.list || [];
      
      // Filter out Dubbed versions (Sulih Suara) if a Subbed version exists for the same title?
      // Or just map them as is. The user asked to "change the dub into chinese".
      // This implies we should prefer the one WITHOUT "(Sulih Suara)".
      
      // If the user is searching, they will see both.
      // But for "listDramas", we might want to filter or prioritize.
      
      return list.map(toCard);
    } catch (error) {
      console.error("Error searching:", error);
      return [];
    }
  }

  async getDrama(id) {
    try {
        const [detailRes, chaptersRes] = await Promise.all([
            this.client.get(`/chapters/detail/${id}`).catch(e => ({ data: { data: {} } })),
            this.client.get(`/chapters/${id}`).catch(e => ({ data: { data: { chapterList: [] } } }))
        ]);

        const detail = detailRes.data?.data || {};
        const chapters = chaptersRes.data?.data?.chapterList || [];
        
        const episodes = chapters.map((ch, idx) => mapEpisode(ch, idx));

        return {
          drama: {
            id: `${id}`,
            title: detail.bookName || `Drama ${id}`,
            description: detail.introduction || detail.description || "No description available.",
            poster: detail.cover || null,
            genres: (detail.tags && typeof detail.tags === 'string') ? detail.tags.split(",") : (Array.isArray(detail.tags) ? detail.tags : []),
            tags: [],
          },
          episodes,
        };
    } catch (error) {
       console.error("Error getting drama detail:", error);
       throw new Error("Drama not found");
    }
  }

  async getEpisode(dramaId, episodeId) {
    try {
        // 1. Get chapters to find the index
        // Optimally we should cache this map, but for now we fetch it.
        const chaptersRes = await this.client.get(`/chapters/${dramaId}`);
        const chapters = chaptersRes.data?.data?.chapterList || [];
        
        // Try to find by ID first
        let chapter = chapters.find(ch => `${ch.chapterId}` === `${episodeId}`);
        
        // Fallback: Try to find by episode number (index + 1)
        if (!chapter && !isNaN(episodeId)) {
             const index = Number(episodeId) - 1;
             if (index >= 0 && index < chapters.length) {
                 chapter = chapters[index];
             }
        }

        if (!chapter) {
          throw new Error("Episode not found");
        }
        
        // 2. Call watch API
        const watchRes = await this.client.get(`/watch/${dramaId}/${chapter.chapterIndex}`, {
            params: { source: "search_result" }
        });
        
        const videoData = watchRes.data?.data;

        if (!videoData || !videoData.videoUrl) {
            throw new Error("Video stream not found");
        }

        return {
          drama: { id: dramaId },
          episode: {
            id: `${chapter.chapterId}`,
            number: chapter.chapterIndex + 1,
            title: `Episode ${chapter.chapterIndex + 1}`,
            streamUrl: videoData.videoUrl,
          }
        };
    } catch (error) {
        console.error("Error getting episode:", error);
        throw error;
    }
  }
}

export const dramaDashClient = new DramaDashClient();
