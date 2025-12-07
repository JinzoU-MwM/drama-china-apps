import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { palette } from "../theme/colors.js";
import { radius, spacing } from "../theme/metrics.js";

export function FilterPills({ options, value, onChange }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {options.map((option) => {
        const active = value === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    marginBottom: spacing(1.5),
  },
  pill: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(0.75),
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    marginRight: spacing(1),
  },
  pillActive: {
    backgroundColor: "rgba(233,64,87,0.15)",
    borderColor: palette.orchid,
  },
  label: {
    color: palette.fog,
    fontWeight: "600",
  },
  labelActive: {
    color: palette.snow,
  },
});
