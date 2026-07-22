import React, { useRef, useEffect } from "react";
import { View, Text, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

type StreakProps = {
    streak: number;
};

export default function Streak({ streak }: StreakProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
        ]).start();
    }, []);

    // Fun messages based on streak
    const getMessage = () => {
        if (streak === 0) return "Start your journey today!";
        if (streak === 1) return "Great start! Keep it up.";
        if (streak < 3) return "You're building momentum!";
        if (streak < 7) return "You're doing amazing!";
        if (streak < 14) return "What a warrior! 🔥";
        return "Unstoppable! You're glowing!";
    };

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
            }}
            className="mx-5 my-3"
        >
            <BlurView
                intensity={60}
                tint="light"
                className="rounded-3xl overflow-hidden border border-white/40"
                style={{
                    shadowColor: "#8854C0",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.1,
                    shadowRadius: 24,
                    elevation: 6,
                }}
            >
                <LinearGradient
                    colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.8)"]}
                    className="p-5 flex-row items-center"
                >
                    {/* Fire Icon Circle */}
                    <View
                        className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                        style={{
                            backgroundColor: streak > 0 ? "rgba(249,115,22,0.1)" : "rgba(136,84,192,0.08)",
                            borderWidth: 1.5,
                            borderColor: streak > 0 ? "rgba(249,115,22,0.2)" : "rgba(136,84,192,0.15)",
                        }}
                    >
                        <Text className="text-3xl">{streak > 0 ? "🔥" : "✨"}</Text>
                    </View>

                    {/* Text Content */}
                    <View className="flex-1">
                        <View className="flex-row items-baseline gap-1">
                            <Text className="text-3xl font-bold text-neutral-800">
                                {streak}
                            </Text>
                            <Text className="text-base font-semibold text-neutral-500">
                                {streak === 1 ? "Day" : "Days"}
                            </Text>
                        </View>
                        
                        <Text className="text-xs text-neutral-400 mt-1 leading-4">
                            {getMessage()}
                        </Text>
                    </View>

                    {/* Decorative flame icon for active streaks */}
                    {streak > 2 && (
                        <View className="absolute top-3 right-3 opacity-10">
                            <Feather name="zap" size={24} color="#F97316" />
                        </View>
                    )}
                </LinearGradient>
            </BlurView>
        </Animated.View>
    );
}