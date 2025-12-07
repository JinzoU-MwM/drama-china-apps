import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { palette } from "../theme/colors.js";
import { radius, spacing } from "../theme/metrics.js";

export function SearchBar({ value, onChangeText, placeholder = "Search dramas" }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={palette.fog}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: radius.lg,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(0.75),
    marginBottom: spacing(2),
  },
  input: {
    color: palette.snow,
    fontSize: 16,
  },
});
