import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { palette, gradients } from "../theme/colors.js";
import { radius, spacing } from "../theme/metrics.js";

export function DramaCard({ item, onPress, variant = "portrait" }) {
  const isLandscape = variant === "landscape";

  return (
    <Pressable onPress={() => onPress?.(item)} style={[styles.card, isLandscape && styles.cardLandscape]}>
      <Image
        source={{ uri: isLandscape ? item.thumbnail : item.poster }}
        style={[styles.image, isLandscape && styles.imageLandscape]}
        resizeMode={isLandscape ? "cover" : "cover"}
      />
      <LinearGradient
        colors={gradients.card}
        style={[styles.overlay, isLandscape && styles.overlayLandscape]}
      />
      <View style={styles.meta}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.subtitle}>
          {item.genres.slice(0, 2).join(" • ")}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: spacing(24),
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  cardLandscape: {
    width: "100%",
    height: spacing(16), // Slightly taller for better detail visibility
    flexDirection: 'row', // Ensure image and text can be side-by-side if we wanted, but current design is overlay
    marginBottom: spacing(1),
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageLandscape: {
    borderRadius: radius.md,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayLandscape: {
    borderRadius: radius.md,
  },
  meta: {
    position: "absolute",
    bottom: spacing(1.5),
    left: spacing(1.5),
    right: spacing(1.5),
  },
  title: {
    color: palette.snow,
    fontWeight: "700",
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  subtitle: {
    color: palette.fog,
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
});
