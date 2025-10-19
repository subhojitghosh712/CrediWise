import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Image
} from "react-native";
import { Text } from "react-native-paper";
import lessonsData from "../data/lessons.json";

const { width, height } = Dimensions.get("window");

export default function LearnScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;

  const renderItem = ({ item, index }: any) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: "clamp",
    });

    return (
      <View style={{ width, justifyContent: "center", alignItems: "center" }}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <Text style={styles.emoji}>{item.emoji || "📚"}</Text>
          <Text style={styles.title}>{item.title}</Text>

          <View style={{ height: 10 }} />
          <Text style={styles.content}>{item.content}</Text>

          <Text style={styles.sectionHeader}>Tips 💡</Text>
          {item.tips && item.tips.length > 0 && (
            <View style={{ marginVertical: 10 }}>
              {item.tips.map((tip: string, idx: number) => (
                <Text key={idx} style={styles.tipLine}>
                  {tip}
                </Text>
              ))}
            </View>
          )}

          {item.summary && <Text style={styles.summary}>📝 {item.summary}</Text>}
        </Animated.View>
      </View>
    );
  };

  // Dot indicators
  const dotPosition = Animated.divide(scrollX, width);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/fl.png')}
        style={styles.icon}
      />

      <Animated.FlatList
        data={lessonsData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ alignItems: "center" }}
        snapToAlignment="center"
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />

      {/* Dot Indicators */}
      <View style={styles.dotsContainer}>
        {lessonsData.map((_, i) => {
          const opacity = dotPosition.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          const scale = dotPosition.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={i.toString()}
              style={[
                styles.dot,
                { opacity, transform: [{ scale }] },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: 20,
    alignItems:"center"
  },
  card: {
    width: width * 0.9,
    height: height * 0.40,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: { fontSize: 40, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "700", color: "#1a73e8", textAlign: "center", marginBottom: 8 },
  content: { fontSize: 16, color: "#333", textAlign: "center", lineHeight: 22, marginBottom: 10 },
  sectionHeader: { fontSize: 16, fontWeight: "600", color: "#1a73e8", textAlign: "center" },
  tipLine: { fontSize: 15, color: "#444", fontStyle: "italic", marginBottom: 4, textAlign: "center" },
  summary: { fontSize: 15, color: "#1a73e8", fontWeight: "600", textAlign: "center", marginTop: 20 },
  icon: { width: 500, height: 300 },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1a73e8",
    marginHorizontal: 4,
  },
});
