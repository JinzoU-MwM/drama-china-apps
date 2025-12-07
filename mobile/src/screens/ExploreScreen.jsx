import React, { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../api/client.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { SearchBar } from "../components/SearchBar.jsx";
import { FilterPills } from "../components/FilterPills.jsx";
import { DramaCard } from "../components/DramaCard.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { palette } from "../theme/colors.js";
import { spacing } from "../theme/metrics.js";

const GENRES = [
  { label: "All", value: "" },
  { label: "Romance", value: "Romance" },
  { label: "Fantasy", value: "Fantasy" },
  { label: "Wuxia", value: "Wuxia" },
  { label: "Thriller", value: "Thriller" },
  { label: "Comedy", value: "Comedy" },
];

export default function ExploreScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState(route.params?.preset === "comfort" ? "Romance" : "");
  const debounced = useDebounce(query, 350);

  const { data, isFetching } = useQuery({
    queryKey: ["explore", debounced, genre],
    queryFn: () => {
      if (debounced) {
        return Api.search(debounced);
      }
      return Api.listDramas({ genre: genre || undefined });
    },
  });

  const items = data?.items ?? [];

  return (
    <View style={[styles.container, { paddingTop: spacing(2) + insets.top }]}>
      <SearchBar value={query} onChangeText={setQuery} />
      <FilterPills options={GENRES} value={genre} onChange={setGenre} />
      {isFetching && !items.length ? (
        <ActivityIndicator color={palette.tangerine} style={{ marginTop: spacing(4) }} />
      ) : null}
      <FlatList
        data={items}
        key={debounced ? "list" : "grid"}
        numColumns={debounced ? 1 : 2}
        columnWrapperStyle={debounced ? undefined : { gap: spacing(1.5) }}
        contentContainerStyle={{ paddingBottom: spacing(8), gap: spacing(2) }}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <DramaCard
            item={item}
            variant={debounced ? "landscape" : "portrait"}
            onPress={() => navigation.navigate("Detail", { dramaId: item.id })}
          />
        )}
        ListEmptyComponent={!isFetching ? (
          <EmptyState title="No matches" subtitle="Try another genre or keyword" />
        ) : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing(2),
    backgroundColor: palette.ink,
  },
});
