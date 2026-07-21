import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";

type MoodCardProps = {
    mood?: string;
    note?: string;
    onPress: () => void;
};

const moodMeta: Record<string, { emoji: string; message: string; color: string; bg: string }> = {
    Happy: { emoji: "😊", message: "Keep nurturing your happiness today.", color: "#D97706", bg: "#FEF3C7" },
    Calm: { emoji: "😌", message: "Peace begins with a quiet heart.", color: "#059669", bg: "#D1FAE5" },
    Sad: { emoji: "😢", message: "It's okay to have difficult days. Be gentle with yourself.", color: "#2563EB", bg: "#DBEAFE" },
    Anxious: { emoji: "😰", message: "Take one breath at a time.", color: "#4F46E5", bg: "#E0E7FF" },
    Angry: { emoji: "😡", message: "This feeling will pass. Breathe deeply.", color: "#DC2626", bg: "#FEE2E2" },
    Excited: { emoji: "🤩", message: "Channel that energy into something great!", color: "#C026D3", bg: "#FAE8FF" },
};

export default function MoodCard({ mood, note, onPress }: MoodCardProps) {
    const meta = mood ? moodMeta[mood] : null;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();
    }, [mood]);

    return (
        <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
            className="mx-5 my-3"
        >
            <BlurView intensity={70} tint="light" className="rounded-3xl overflow-hidden border border-white/40"
                style={{
                    shadowColor: meta?.color || "#8854C0",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.12,
                    shadowRadius: 24,
                    elevation: 6,
                }}
            >
                {/* Colored Top Accent Bar */}
                {meta && (
                    <View style={{ height: 4, backgroundColor: meta.color, opacity: 0.6 }} />
                )}

                <LinearGradient colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.85)"]} className="p-5">
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center gap-2">
                            <View className="w-7 h-7 rounded-full bg-[#8854C0]/10 items-center justify-center">
                                <Feather name="activity" size={14} color="#8854C0" />
                            </View>
                            <Text className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                                Today&apos;s Mood
                            </Text>
                        </View>
                        <View className="px-2.5 py-1 rounded-full bg-neutral-100">
                            <Text className="text-[10px] font-bold text-neutral-400">
                                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </Text>
                        </View>
                    </View>

                    {/* Mood Display */}
                    <View className="flex-row items-center mb-5">
                        <View
                            className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                            style={{
                                backgroundColor: meta ? `${meta.color}12` : "#F5F5F5",
                                borderWidth: 1.5,
                                borderColor: meta ? `${meta.color}25` : "#E5E5E5",
                            }}
                        >
                            <Text className="text-3xl">{meta?.emoji ?? "🌸"}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className={meta ? "text-2xl font-bold text-neutral-800" : "text-lg font-medium text-neutral-400"}>
                                {mood ?? "How are you feeling?"}
                            </Text>
                            <Text className="text-xs text-neutral-500 mt-1 leading-4">
                                {meta?.message ?? "Take a moment to check in with yourself."}
                            </Text>
                        </View>
                    </View>

                    {/* Note */}
                    {note ? (
                        <View className="mb-5 p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-100">
                            <View className="flex-row items-center gap-1.5 mb-1">
                                <Feather name="edit-3" size={12} color="#8854C0" />
                                <Text className="text-[10px] font-bold uppercase tracking-wider text-[#8854C0]">Note</Text>
                            </View>
                            <Text className="text-sm text-neutral-600 leading-5" numberOfLines={2}>{note}</Text>
                        </View>
                    ) : meta ? (
                        <View className="mb-5 p-3 rounded-xl bg-neutral-50/50 border border-dashed border-neutral-200">
                            <Text className="text-xs text-neutral-400 italic text-center">No note added for this mood</Text>
                        </View>
                    ) : null}

                    {/* CTA */}
                    <TouchableOpacity
                        onPress={onPress}
                        activeOpacity={0.85}
                        className="w-full rounded-2xl items-center justify-center flex-row gap-2"
                        style={{
                            backgroundColor: "#8854C0",
                            paddingVertical: 14,
                            shadowColor: "#8854C0",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.25,
                            shadowRadius: 12,
                            elevation: 4,
                        }}
                    >
                        <Text className="text-white font-bold text-[15px]">
                            {meta ? "Update Mood" : "Log Your Mood"}
                        </Text>
                        <Feather name="arrow-right" size={16} color="white" />
                    </TouchableOpacity>
                </LinearGradient>
            </BlurView>
        </Animated.View>
    );
}