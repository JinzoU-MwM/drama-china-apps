import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWatchlist } from "../state/watchlistContext.js";
import { palette } from "../theme/colors.js";
import { spacing } from "../theme/metrics.js";
import { DramaCard } from "../components/DramaCard.jsx";
import { EmptyState } from "../components/EmptyState.jsx";

export default function LibraryScreen() {
  const { items } = useWatchlist();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: spacing(2) + insets.top }]}>
      <Text style={styles.title}>My List</Text>
      <FlatList
        data={items}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        columnWrapperStyle={{ gap: spacing(1.5) }}
        contentContainerStyle={{ paddingBottom: spacing(6), gap: spacing(2) }}
        renderItem={({ item }) => (
          <DramaCard item={item} onPress={() => navigation.navigate("Detail", { dramaId: item.id })} />
        )}
        ListEmptyComponent={<EmptyState title="No saved dramas" subtitle="Tap the bookmark icon to add" />}
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
  title: {
    color: palette.snow,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: spacing(2),
  },
});
