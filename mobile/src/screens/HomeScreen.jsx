import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../api/client.js";
import { palette } from "../theme/colors.js";
import { spacing } from "../theme/metrics.js";
import { HeroBanner } from "../components/HeroBanner.jsx";
import { SectionHeader } from "../components/SectionHeader.jsx";
import { DramaCard } from "../components/DramaCard.jsx";

export default function HomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["home"],
    queryFn: Api.getHome,
  });

  if (isLoading) {
    return (
      <View style={styles.center}> 
        <ActivityIndicator color={palette.tangerine} />
        <Text style={styles.loadingText}>Loading premium queues…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: spacing(2) + insets.top }]}
    >
      <HeroBanner hero={data?.hero} onPressCta={() => navigation.navigate("Library")} />
      {data?.sections?.map((section) => (
        <View key={section.id} style={styles.section}>
          <SectionHeader
            title={section.title}
            subtitle={section.subtitle}
            actionLabel="See all"
            onAction={() => navigation.navigate("Explore", { preset: section.id })}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {section.items?.map((item, index) => (
              <DramaCard
                key={`${item.id}-${index}`}
                item={item}
                variant={section.layout === "landscape" ? "landscape" : "portrait"}
                onPress={() => navigation.navigate("Detail", { dramaId: item.id })}
              />
            ))}
          </ScrollView>
        </View>
      ))}
      <Text style={styles.timestamp}>Last updated {new Date().toLocaleTimeString()}</Text>
      <Text style={styles.refresh} onPress={() => refetch()}>
        {isRefetching ? "Refreshing…" : "Refresh"}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.ink,
  },
  content: {
    padding: spacing(2),
    paddingBottom: spacing(8),
  },
  section: {
    marginBottom: spacing(3),
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
  timestamp: {
    color: palette.fog,
    textAlign: "center",
    marginTop: spacing(2),
  },
  refresh: {
    color: palette.tangerine,
    textAlign: "center",
    marginTop: 6,
    textDecorationLine: "underline",
  },
});
