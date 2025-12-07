import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { GradientButton } from "./GradientButton.jsx";
import { palette } from "../theme/colors.js";
import { radius, spacing } from "../theme/metrics.js";

export function HeroBanner({ hero, onPressCta }) {
  if (!hero) return null;

  return (
    <ImageBackground source={{ uri: hero.background }} style={styles.container}>
      <View style={styles.overlay} />
      <BlurView intensity={40} tint="dark" style={styles.panel}>
        <Text style={styles.kicker}>Simulcast</Text>
        <Text style={styles.title}>{hero.title}</Text>
        <Text style={styles.subtitle}>{hero.subtitle}</Text>
        <GradientButton label={hero.cta} onPress={onPressCta} />
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: spacing(32),
    borderRadius: radius.xl,
    overflow: "hidden",
    marginBottom: spacing(3),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  panel: {
    position: "absolute",
    bottom: spacing(2.5),
    left: spacing(2.5),
    right: spacing(2.5),
    borderRadius: radius.lg,
    padding: spacing(2),
    gap: spacing(1),
  },
  kicker: {
    color: palette.cyan,
    fontWeight: "600",
    letterSpacing: 1,
  },
  title: {
    color: palette.snow,
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: palette.snow,
    opacity: 0.8,
    fontSize: 15,
  },
});
