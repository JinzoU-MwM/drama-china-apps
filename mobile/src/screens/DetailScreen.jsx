import React from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Api } from "../api/client.js";
import { palette } from "../theme/colors.js";
import { radius, spacing } from "../theme/metrics.js";
import { EpisodeRow } from "../components/EpisodeRow.jsx";
import { GradientButton } from "../components/GradientButton.jsx";
import { useWatchlist } from "../state/watchlistContext.js";

export default function DetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dramaId = route.params?.dramaId;
  const { isSaved, toggle } = useWatchlist();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["drama", dramaId],
    queryFn: () => Api.getDrama(dramaId),
    enabled: Boolean(dramaId),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={palette.tangerine} />
        <Text style={styles.loadingText}>Fetching drama intel…</Text>
      </View>
    );
  }

  const drama = data?.drama;
  const episodes = data?.episodes ?? [];

  if (!drama) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Drama unavailable.</Text>
        <Text style={styles.refresh} onPress={() => refetch()}>
          Retry
        </Text>
      </View>
    );
  }

  const handlePlay = (episode) => {
    navigation.navigate("Player", {
      dramaId: drama.id,
      episodeNumber: episode.number,
      title: drama.title,
    });
  };

  const firstEpisode = episodes[0];

  return (
    <View style={styles.root}>
      <View style={[styles.backButton, { top: insets.top + 10 }]}>
        <Feather name="chevron-left" size={32} color={palette.snow} onPress={() => navigation.goBack()} />
      </View>
      <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: 0 }]}>
        <ImageBackground source={{ uri: drama.poster }} style={styles.poster}>
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.posterOverlay} />
        <View style={styles.posterContent}>
          <Text style={styles.kicker}>{drama.genres?.slice(0, 2).join(" • ")}</Text>
          <Text style={styles.title}>{drama.title}</Text>
          <Text style={styles.desc}>{drama.description}</Text>
          <View style={styles.ctaRow}>
            <GradientButton label="Watch" onPress={() => firstEpisode && handlePlay(firstEpisode)} />
            <GradientButton
              label={isSaved(drama.id) ? "Saved" : "Add"}
              onPress={() => toggle(drama.id)}
              icon={<Feather name={isSaved(drama.id) ? "check" : "bookmark"} size={18} color={palette.snow} />}
              style={styles.saveButton}
            />
          </View>
        </View>
      </ImageBackground>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Episodes</Text>
        {episodes.map((episode, index) => (
          <EpisodeRow key={`${episode.id}-${index}`} episode={episode} onPlay={handlePlay} />
        ))}
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.ink,
  },
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    left: spacing(2),
    zIndex: 10,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
  },
  content: {
    paddingBottom: spacing(6),
  },
  poster: {
    height: spacing(36),
    justifyContent: "flex-end",
  },
  posterOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  posterContent: {
    padding: spacing(2),
    gap: spacing(1),
  },
  kicker: {
    color: palette.fog,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontSize: 12,
  },
  title: {
    color: palette.snow,
    fontSize: 28,
    fontWeight: "800",
  },
  desc: {
    color: palette.fog,
  },
  ctaRow: {
    flexDirection: "row",
    gap: spacing(1),
  },
  saveButton: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing(2),
    paddingTop: spacing(3),
  },
  sectionTitle: {
    color: palette.snow,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing(1.5),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.ink,
  },
  loadingText: {
    color: palette.snow,
    marginTop: spacing(1),
  },
  refresh: {
    color: palette.tangerine,
    marginTop: spacing(1),
    textDecorationLine: "underline",
  },
});
