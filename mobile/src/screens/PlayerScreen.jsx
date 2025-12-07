import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useVideoPlayer, VideoView } from "expo-video";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureDetector, Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import { Api } from "../api/client.js";
import { palette } from "../theme/colors.js";
import { spacing } from "../theme/metrics.js";

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get("window");

// Simple Progress Bar Component
function ProgressBar({ currentTime, duration }) {
  if (!duration) return null;
  const progress = Math.min(Math.max(currentTime / duration, 0), 1);
  
  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
    </View>
  );
}

function formatTime(seconds) {
  if (!seconds) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function EpisodePlayer({ item, isActive, dramaId, toggleControls, controlsVisible }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stream", dramaId, item.id],
    queryFn: () => Api.getStream({ dramaId, episodeId: item.id }),
    enabled: isActive,
  });

  const streamUrl = data?.episode?.streamUrl;
  const player = useVideoPlayer(streamUrl ?? null);
  
  // Local state for progress tracking to update UI frequently
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (player) {
      if (isActive && streamUrl) {
        player.replace(streamUrl);
        player.play();
        
        // Subscribe to time updates
        const interval = setInterval(() => {
            setCurrentTime(player.currentTime);
            setDuration(player.duration);
        }, 500);
        
        return () => clearInterval(interval);
      } else {
        player.pause();
      }
    }
  }, [isActive, streamUrl, player]);

  // Gestures
  const singleTap = Gesture.Tap()
    .runOnJS(true)
    .onEnd((_e, success) => {
    if (success) {
        toggleControls();
    }
  });

  // Double tap left (Rewind)
  const doubleTapLeft = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(250)
    .runOnJS(true)
    .onEnd((e, success) => {
      if (success && e.x < WINDOW_WIDTH / 2 && player) {
        player.currentTime = Math.max(0, player.currentTime - 10);
      }
    });

  // Double tap right (Fast Forward)
  const doubleTapRight = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(250)
    .runOnJS(true)
    .onEnd((e, success) => {
      if (success && e.x >= WINDOW_WIDTH / 2 && player) {
        player.currentTime = Math.min(player.duration, player.currentTime + 10);
      }
    });

  // Compose gestures: Double taps take precedence over single tap
  // Exclusive means if double tap fails (timeout), single tap triggers.
  const gestures = Gesture.Exclusive(doubleTapLeft, doubleTapRight, singleTap);

  return (
    <View style={styles.pageContainer}>
      <GestureDetector gesture={gestures}>
        <View style={styles.gestureArea}>
          {isLoading && (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={palette.tangerine} />
              <Text style={styles.loadingText}>Loading Episode {item.number}...</Text>
            </View>
          )}
          
          {error && (
            <View style={styles.center}>
              <Feather name="alert-circle" size={40} color={palette.crimson} />
              <Text style={styles.errorText}>Failed to load episode</Text>
            </View>
          )}

          {streamUrl && (
            <VideoView
              style={styles.video}
              player={player}
              contentFit="contain"
              nativeControls={false}
            />
          )}
          
          {/* Controls Overlay (Title, Progress, Duration) */}
          {controlsVisible && (
             <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={styles.bottomOverlay}
                pointerEvents="none"
              >
                <Text style={styles.episodeTitle}>Episode {item.number}</Text>
                <Text style={styles.episodeSubtitle}>{item.title}</Text>
                
                <View style={styles.timeRow}>
                    <ProgressBar currentTime={currentTime} duration={duration} />
                    <Text style={styles.durationText}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </Text>
                </View>
              </LinearGradient>
          )}
        </View>
      </GestureDetector>
    </View>
  );
}

export default function PlayerScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { dramaId, episodeNumber } = route.params ?? {};
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef(null);
  const flatListRef = useRef(null);

  const toggleControls = useCallback(() => {
    setControlsVisible((prev) => !prev);
  }, []);

  // Auto-hide controls logic
  useEffect(() => {
    if (controlsVisible) {
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            setControlsVisible(false);
        }, 4000);
    }
    return () => {
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [controlsVisible]);

  // Fetch all episodes
  const { data: dramaData, isLoading: isDramaLoading } = useQuery({
    queryKey: ["drama", dramaId],
    queryFn: () => Api.getDrama(dramaId),
    enabled: Boolean(dramaId),
  });

  const episodes = dramaData?.episodes ?? [];

  useEffect(() => {
    if (episodes.length > 0 && episodeNumber != null) {
      const index = episodes.findIndex((e) => e.number === Number(episodeNumber));
      if (index !== -1) {
        setActiveIndex(index);
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index, animated: false });
        }, 100);
      }
    }
  }, [episodes, episodeNumber]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const getItemLayout = (_, index) => ({
    length: WINDOW_HEIGHT,
    offset: WINDOW_HEIGHT * index,
    index,
  });

  if (isDramaLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={palette.tangerine} style={{ marginTop: 100 }} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <FlatList
        ref={flatListRef}
        data={episodes}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <EpisodePlayer 
            item={item} 
            isActive={index === activeIndex} 
            dramaId={dramaId}
            toggleControls={toggleControls}
            controlsVisible={controlsVisible}
          />
        )}
        pagingEnabled
        vertical
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        style={{ flex: 1 }}
      />

      {/* Back Button Overlay - visibility controlled by state */}
      {controlsVisible && (
          <View style={[styles.headerOverlay, { top: insets.top + 10 }]}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Feather name="chevron-left" size={32} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
                {dramaData?.drama?.title}
            </Text>
          </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  pageContainer: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  gestureArea: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  loadingText: {
    color: palette.snow,
    marginTop: spacing(2),
    fontSize: 14,
  },
  errorText: {
    color: palette.snow,
    marginTop: spacing(2),
    fontSize: 14,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
    paddingHorizontal: spacing(3),
    paddingBottom: spacing(6),
    paddingTop: spacing(6),
  },
  episodeTitle: {
    color: palette.tangerine,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing(0.5),
  },
  episodeSubtitle: {
    color: palette.snow,
    fontSize: 14,
    opacity: 0.9,
    marginBottom: spacing(2),
  },
  headerOverlay: {
    position: "absolute",
    left: spacing(2),
    right: spacing(2),
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginRight: spacing(2),
  },
  headerTitle: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      flex: 1,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: {width: -1, height: 1},
      textShadowRadius: 10
  },
  timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing(2),
  },
  progressContainer: {
      flex: 1,
      height: 4,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 2,
      overflow: 'hidden',
  },
  progressBar: {
      height: '100%',
      backgroundColor: palette.tangerine,
  },
  durationText: {
      color: palette.snow,
      fontSize: 12,
      fontVariant: ['tabular-nums'],
  }
});
