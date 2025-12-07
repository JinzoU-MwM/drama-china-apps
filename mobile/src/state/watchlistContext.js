import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Api } from "../api/client.js";

const STORAGE_KEY = "@drama_china:watchlist";

const WatchlistContext = createContext({
  items: [],
  isSaved: () => false,
  toggle: async () => {},
  refresh: async () => {},
});

export function WatchlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setItems(JSON.parse(raw));
        }
      } catch (error) {
        console.warn("Failed to hydrate watchlist", error);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next) => {
    setItems(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn("Failed to persist watchlist", error);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const response = await Api.getWatchlist();
      persist(response.items ?? []);
    } catch (error) {
      console.warn("Unable to refresh watchlist", error.message);
    }
  }, [persist]);

  useEffect(() => {
    if (hydrated) {
      refresh();
    }
  }, [hydrated, refresh]);

  const toggle = useCallback(
    async (dramaId) => {
      try {
        const response = await Api.toggleWatchlist(dramaId);
        persist(response.items ?? []);
      } catch (error) {
        console.warn("Toggle watchlist failed", error.message);
      }
    },
    [persist]
  );

  const value = {
    items,
    isSaved: (id) => items.some((item) => item.id === id),
    toggle,
    refresh,
  };

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}
