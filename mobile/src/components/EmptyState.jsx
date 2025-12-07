import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { palette } from "../theme/colors.js";

export function EmptyState({ title = "Nothing yet", subtitle = "", style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: "center",
  },
  title: {
    color: palette.snow,
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    color: palette.fog,
    marginTop: 6,
    textAlign: "center",
  },
});
