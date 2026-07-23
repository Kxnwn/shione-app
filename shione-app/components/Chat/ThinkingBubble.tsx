import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";

function Dot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 350,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={{ opacity }}
      className="w-2 h-2 rounded-full bg-[#9B6DD6] mx-0.5"
    />
  );
}

export default function ThinkingBubble() {
  return (
    <View className="items-start" style={{ marginVertical: 4 }}>
      <Text className="text-[11px] text-neutral-400 font-medium mb-1 ml-12">
        Shione
      </Text>

      <View className="flex-row items-end gap-2 max-w-[85%]">
        <View className="w-7 h-7 rounded-full bg-[#8854C0]/10 items-center justify-center mb-1 border border-[#8854C0]/10">
          <Text className="text-sm">🌸</Text>
        </View>

        <View
          className="px-4 py-3.5 rounded-2xl rounded-bl-md bg-white border border-purple-100 flex-row items-center"
          style={{
            shadowColor: "#8854C0",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
            <Text>Thinking</Text>
          <Dot delay={0} />
          <Dot delay={150} />
          <Dot delay={300} />
        </View>
      </View>
    </View>
  );
}