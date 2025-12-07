import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradients, palette } from "../theme/colors.js";
import { radius, spacing } from "../theme/metrics.js";

export function GradientButton({ label, onPress, icon, style }) {
  return (
    <Pressable onPress={onPress} style={[styles.wrapper, style]}>
      <LinearGradient colors={gradients.button} style={styles.gradient}>
        {icon}
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  gradient: {
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(3),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing(0.75),
  },
  label: {
    color: palette.snow,
    fontWeight: "700",
    fontSize: 16,
  },
});
