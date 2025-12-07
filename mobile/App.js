import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator.jsx";
import { queryClient } from "./src/state/queryClient.js";
import { WatchlistProvider } from "./src/state/watchlistContext.js";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WatchlistProvider>
        <SafeAreaProvider>
          <RootNavigator />
          <StatusBar style="light" />
        </SafeAreaProvider>
      </WatchlistProvider>
    </QueryClientProvider>
  );
}
