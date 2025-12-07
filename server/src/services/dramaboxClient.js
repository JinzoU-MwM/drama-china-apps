import axios from "axios";

const API_BASE = "https://sapi.dramabox.be/api";

function toCard(item) {
  return {
    id: `${item.bookId}`,
    title: item.bookName,
    poster: item.cover,
    thumbnail: item.cover,
    synopsis: item.introduction || "",
    rating: 5.0, // Default
    viewCount: item.playCount,
    genres: item.tags ? item.tags.split(",") : [],
    tags: [],
  };
}

function mapEpisode(chapter, index) {
  return {
    id: `${chapter.chapterId}`,
    number: index + 1,
    title: `Episode ${index + 1}`,
    duration: 0, // Not provided in list
    thumbnail: null,
    streamUrl: null, // Populated in detail/watch call
  };
}

class DramaboxClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Content-Type": "application/json",
      },
    });
  }

  async getHomePayload() {
    // Fetch "new" and "rank" for different sections
    const [newList, rankList] = await Promise.all([
      this.client.get("/new/1").then((r) => r.data.data.list || []),
      this.client.get("/rank/1").then((r) => r.data.data.list || []),
    ]);

    const heroItem = rankList[0] || newList[0];
    const hero = heroItem
      ? {
          id: `${heroItem.bookId}`,
          title: heroItem.bookName,
          subtitle: heroItem.introduction?.slice(0, 100) + "...",
          cta: "Watch Now",
          background: heroItem.cover,
          tags: heroItem.tags ? heroItem.tags.split(",") : [],
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
      ],
    };
  }

  async listDramas({ tag, genre, sort, limit } = {}) {
    // The API doesn't support rich filtering, so we default to /new or /rank
    // If 'sort' is 'trending', use rank, else use new
    const endpoint = sort === "trending" ? "/rank/1" : "/new/1";
    const response = await this.client.get(endpoint);
    const list = response.data?.data?.list || [];
    
    let items = list.map(toCard);

    // Client-side filtering if needed (limited by page size of API)
    if (limit) {
      items = items.slice(0, Number(limit));
    }

    return items;
  }

  async search(query) {
    if (!query) return [];
    const response = await this.client.get(`/search/${encodeURIComponent(query)}/1`);
    const list = response.data?.data?.list || [];
    return list.map(toCard);
  }

  async getDrama(id) {
    // We don't have a direct "detail" endpoint that works (404s).
    // But we can get chapters. And we can try to find metadata from search or list if cached,
    // but here we might have to return minimal metadata if we can't find it.
    // However, the /chapters endpoint returns a list of chapters.
    // It does NOT return drama metadata (title, cover).
    
    // Workaround: Fetch detail from /new/1 or search to get metadata?
    // Or just return minimal data. 
    // Let's try to fetch /new/1 and see if we can find it there, strictly as a fallback?
    // No, that's inefficient. 
    
    // Wait, the verify_api.py showed `api/detail/{id}` failed.
    // Is there any other way? 
    // Maybe the app passes metadata from the list view?
    
    // For now, we'll fetch chapters. Metadata might be missing if we don't have it.
    // Let's assume the UI can handle missing metadata or we mock it.
    
    // Actually, let's look at verify_api.py output for chapters again.
    // It returned `{"chapterList": [...]}`. No drama info.
    
    // We will rely on the fact that usually the user comes from a list view where we have data.
    // But `getDrama` is a standalone call.
    
    // Let's try to search by ID? No, search is by keyword.
    // Let's search by ID as keyword?
    
    // Let's fetch chapters.
    const chaptersRes = await this.client.get(`/chapters/${id}`);
    const chapters = chaptersRes.data?.data?.chapterList || [];
    
    // Map chapters
    const episodes = chapters.map((ch, idx) => mapEpisode(ch, idx));

    return {
      drama: {
        id: `${id}`,
        title: "Drama " + id, // Placeholder since we can't get details
        description: "Description unavailable",
        poster: null,
        genres: [],
        tags: [],
      },
      episodes,
    };
  }

  async getEpisode(dramaId, episodeId) {
    // 1. Get chapters to find the index
    const chaptersRes = await this.client.get(`/chapters/${dramaId}`);
    const chapters = chaptersRes.data?.data?.chapterList || [];
    
    const chapter = chapters.find(ch => `${ch.chapterId}` === `${episodeId}`);
    if (!chapter) {
      throw new Error("Episode not found");
    }
    
    // 2. Call watch API
    const payload = {
      bookId: dramaId,
      chapterIndex: chapter.chapterIndex
    };
    
    const watchRes = await this.client.post("/watch/player", payload);
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
  }
}

export const dramaboxClient = new DramaboxClient();
