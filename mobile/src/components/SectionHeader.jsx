import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { palette } from "../theme/colors.js";

export function SectionHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: palette.snow,
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: palette.fog,
    marginTop: 4,
  },
  action: {
    color: palette.tangerine,
    fontWeight: "600",
  },
});
