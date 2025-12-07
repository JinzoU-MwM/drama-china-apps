export const dramas = [
  {
    id: "eternal-love",
    title: "Eternal Love of the Lotus",
    year: 2024,
    rating: 9.1,
    synopsis:
      "A celestial physician returns to the mortal realm to protect a reincarnated empress while unraveling a conspiracy between divine clans.",
    genres: ["Fantasy", "Romance", "Historical"],
    poster:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    banner:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    tags: ["Exclusive", "Trending"],
    cast: [
      "Liu Meiyu",
      "Chen Liang",
      "Zhao Rui",
      "Li Wen",
      "Gao Renshu",
    ],
    regions: ["CN"],
    runtime: 45,
    releaseSchedule: "Mon-Thu 20:00 CST",
    episodes: Array.from({ length: 24 }).map((_, index) => {
      const number = index + 1;
      return {
        id: `eternal-love-ep-${number}`,
        number,
        title: `Episode ${number}`,
        duration: 45,
        thumbnail:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
        streamUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        subtitles: [
          { language: "zh", label: "中文", url: "https://bit.ly/3y1jIIE" },
          { language: "en", label: "English", url: "https://bit.ly/3y1jIIE" },
        ],
      };
    }),
  },
  {
    id: "jade-dynasty",
    title: "Jade Dynasty Reborn",
    year: 2023,
    rating: 8.8,
    synopsis:
      "An exiled prince must master forbidden martial scrolls to reclaim the Jade Dynasty throne before a solar eclipse seals his fate.",
    genres: ["Wuxia", "Action", "Adventure"],
    poster:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    banner:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    tags: ["Hot", "Cinematic"],
    cast: ["Xu Kai", "Meng Ziyi", "Tang Wei"],
    regions: ["CN", "SG"],
    runtime: 50,
    releaseSchedule: "Fri-Sat 21:30 CST",
    episodes: Array.from({ length: 32 }).map((_, index) => {
      const number = index + 1;
      return {
        id: `jade-dynasty-ep-${number}`,
        number,
        title: `Scroll ${number}`,
        duration: 48,
        thumbnail:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
        streamUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        subtitles: [
          { language: "zh", label: "中文", url: "https://bit.ly/3y1jIIE" },
          { language: "en", label: "English", url: "https://bit.ly/3y1jIIE" },
        ],
      };
    }),
  },
  {
    id: "city-lights",
    title: "City of Falling Lights",
    year: 2022,
    rating: 8.5,
    synopsis:
      "A brilliant prosecutor and a celebrity lawyer team up to solve the mysterious blackout that exposes corruption across Shanghai.",
    genres: ["Thriller", "Romance", "Legal"],
    poster:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1507138451611-3001135909c3?auto=format&fit=crop&w=600&q=80",
    banner:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    tags: ["New", "Urban"],
    cast: ["Li Yitong", "Zhang Binbin", "Qiao Xin"],
    regions: ["CN", "MY", "US"],
    runtime: 42,
    releaseSchedule: "Full Season",
    episodes: Array.from({ length: 16 }).map((_, index) => {
      const number = index + 1;
      return {
        id: `city-lights-ep-${number}`,
        number,
        title: `Case ${number}`,
        duration: 42,
        thumbnail:
          "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
        streamUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        subtitles: [
          { language: "zh", label: "中文", url: "https://bit.ly/3y1jIIE" },
          { language: "en", label: "English", url: "https://bit.ly/3y1jIIE" },
        ],
      };
    }),
  },
  {
    id: "culinary-hearts",
    title: "Culinary Hearts",
    year: 2021,
    rating: 8.2,
    synopsis:
      "Rival chefs must collaborate on a state banquet that could save their hometown from redevelopment.",
    genres: ["Romance", "Slice of Life", "Food"],
    poster:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=600&q=80",
    banner:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80",
    tags: ["Comfort", "Feel-good"],
    cast: ["Tan Songyun", "Lin Gengxin"],
    regions: ["CN", "TW"],
    runtime: 40,
    releaseSchedule: "Full Season",
    episodes: Array.from({ length: 20 }).map((_, index) => {
      const number = index + 1;
      return {
        id: `culinary-hearts-ep-${number}`,
        number,
        title: `Course ${number}`,
        duration: 40,
        thumbnail:
          "https://images.unsplash.com/photo-1446105200970-ec9c31ce6647?auto=format&fit=crop&w=800&q=80",
        streamUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        subtitles: [
          { language: "zh", label: "中文", url: "https://bit.ly/3y1jIIE" },
          { language: "en", label: "English", url: "https://bit.ly/3y1jIIE" },
        ],
      };
    }),
  },
  {
    id: "signal",
    title: "Signal of Tomorrow",
    year: 2025,
    rating: 9.4,
    synopsis:
      "When a quantum radio lets a rookie detective talk to her future self, she must prevent a wave of disappearances in Beijing.",
    genres: ["Sci-Fi", "Crime", "Mystery"],
    poster:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    banner:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    tags: ["Premium", "Simulcast"],
    cast: ["Lareina Song", "Wang Yibo", "Liu Haoran"],
    regions: ["CN", "US", "AU"],
    runtime: 55,
    releaseSchedule: "Wed 22:00 CST",
    episodes: Array.from({ length: 12 }).map((_, index) => {
      const number = index + 1;
      return {
        id: `signal-ep-${number}`,
        number,
        title: `Transmission ${number}`,
        duration: 55,
        thumbnail:
          "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
        streamUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        subtitles: [
          { language: "zh", label: "中文", url: "https://bit.ly/3y1jIIE" },
          { language: "en", label: "English", url: "https://bit.ly/3y1jIIE" },
        ],
      };
    }),
  },
];

export const hero = {
  title: "Binge elite C-dramas in HDR",
  subtitle: "Simulcasts, exclusives, and classics in one glossy feed.",
  cta: "Continue watching",
  background:
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
};
