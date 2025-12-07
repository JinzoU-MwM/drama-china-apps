import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export function withCache(keyBuilder, ttl = 60) {
  return async (req, res, next) => {
    try {
      const key = keyBuilder(req);
      if (!key) return next();
      const cached = cache.get(key);
      if (cached) {
        return res.json({ cached: true, ...cached });
      }

      const originalJson = res.json.bind(res);
      res.json = (payload) => {
        cache.set(key, payload, ttl);
        return originalJson(payload);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function bustCache(pattern) {
  cache.keys().forEach((key) => {
    if (key.startsWith(pattern)) {
      cache.del(key);
    }
  });
}
