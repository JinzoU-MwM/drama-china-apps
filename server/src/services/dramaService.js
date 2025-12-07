import { dramas, hero } from "../data/dramas.js";

const sorters = {
  trending: (a, b) => b.rating - a.rating,
  newest: (a, b) => b.year - a.year,
  runtime: (a, b) => b.runtime - a.runtime,
};

export function listDramas({ tag, genre, limit, sort } = {}) {
  let results = [...dramas];

  if (tag) {
    results = results.filter((drama) =>
      drama.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
    );
  }

  if (genre) {
    results = results.filter((drama) =>
      drama.genres.map((g) => g.toLowerCase()).includes(genre.toLowerCase())
    );
  }

  if (sort && sorters[sort]) {
    results.sort(sorters[sort]);
  }

  if (limit) {
    results = results.slice(0, Number(limit));
  }

  return results;
}

export function getDramaById(id) {
  return dramas.find((drama) => drama.id === id);
}

export function getEpisode(dramaId, episodeId) {
  const drama = getDramaById(dramaId);
  if (!drama) return null;
  const episode = drama.episodes.find((ep) => ep.id === episodeId);
  if (!episode) return null;
  return { drama, episode };
}

export function searchDramas(query) {
  if (!query) return [];
  const normalized = query.trim().toLowerCase();
  return dramas.filter(
    (drama) =>
      drama.title.toLowerCase().includes(normalized) ||
      drama.cast.some((actor) => actor.toLowerCase().includes(normalized)) ||
      drama.genres.some((genre) => genre.toLowerCase().includes(normalized))
  );
}

export function assembleHomePayload() {
  return {
    hero,
    sections: [
      {
        id: "premium",
        title: "Premium Exclusives",
        subtitle: "Only on DramaChina",
        layout: "cover",
        items: listDramas({ tag: "Exclusive", limit: 6 }),
      },
      {
        id: "trending",
        title: "Trending Now",
        subtitle: "Real-time heat index",
        layout: "landscape",
        items: listDramas({ sort: "trending", limit: 10 }),
      },
      {
        id: "fresh",
        title: "Fresh Drops",
        subtitle: "This week's new arrivals",
        layout: "portrait",
        items: listDramas({ sort: "newest", limit: 8 }),
      },
      {
        id: "comfort",
        title: "Comfort Classics",
        subtitle: "Feel-good rewatches",
        layout: "landscape",
        items: listDramas({ tag: "Comfort", limit: 6 }),
      },
    ],
  };
}
