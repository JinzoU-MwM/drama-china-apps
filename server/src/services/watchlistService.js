const watchlists = new Map();

export function getWatchlist(deviceId) {
  if (!deviceId) return [];
  const storage = watchlists.get(deviceId);
  if (!storage) return [];
  return Array.from(storage.values());
}

export function toggleWatchlist(deviceId, dramaMeta) {
  if (!deviceId || !dramaMeta?.id) return getWatchlist(deviceId);
  const existing = watchlists.get(deviceId) ?? new Map();

  if (existing.has(dramaMeta.id)) {
    existing.delete(dramaMeta.id);
  } else {
    existing.set(dramaMeta.id, {
      id: dramaMeta.id,
      title: dramaMeta.title,
      thumbnail: dramaMeta.thumbnail ?? dramaMeta.poster ?? null,
      poster: dramaMeta.poster ?? dramaMeta.thumbnail ?? null,
      rating: dramaMeta.rating ?? null,
      genres: dramaMeta.genres ?? [],
    });
  }

  watchlists.set(deviceId, existing);
  return getWatchlist(deviceId);
}
