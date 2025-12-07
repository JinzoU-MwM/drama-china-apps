import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { palette } from "../theme/colors.js";
import { radius, spacing } from "../theme/metrics.js";

export function EpisodeRow({ episode, onPlay }) {
  return (
    <Pressable style={styles.container} onPress={() => onPlay?.(episode)}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{episode.number}</Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.title}>{episode.title || `Episode ${episode.number}`}</Text>
        <Text style={styles.subtitle}>
          {episode.duration ? `${Math.ceil(episode.duration / 60)} min` : "Short"} • UHD
        </Text>
      </View>
      <Text style={styles.play}>Play</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: radius.md,
    padding: spacing(1.5),
    marginBottom: spacing(1),
  },
  badge: {
    width: spacing(4),
    height: spacing(4),
    borderRadius: radius.sm,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing(1.5),
  },
  badgeText: {
    color: palette.snow,
    fontWeight: "700",
  },
  meta: {
    flex: 1,
  },
  title: {
    color: palette.snow,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    color: palette.fog,
  },
  play: {
    color: palette.tangerine,
    fontWeight: "700",
  },
});
