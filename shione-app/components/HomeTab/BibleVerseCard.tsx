import React, { useRef, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Share, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";

type BibleData = {
    verse: string;
    reference: string;
    category: string;
};

type BibleVerseCardProps = {
    verse?: BibleData | null;
};

// ✅ Fixed: handles both "Sad" and "sadness" from backend
const normalizeCategory = (cat: string): string => {
    const map: Record<string, string> = {
        happy: "hope", calm: "peace", sad: "sadness",
        anxious: "anxiety", angry: "strength", excited: "hope",
    };
    return map[cat.toLowerCase()] || cat.toLowerCase();
};

const categoryConfig: Record<string, { emoji: string; color: string; label: string }> = {
    anxiety: { emoji: "🌊", color: "#3B82F6", label: "Peace for Anxiety" },
    peace: { emoji: "🕊️", color: "#10B981", label: "Peace" },
    comfort: { emoji: "🤗", color: "#F59E0B", label: "Comfort" },
    hope: { emoji: "✨", color: "#EC4899", label: "Hope" },
    sadness: { emoji: "💙", color: "#6366F1", label: "Comfort for Sadness" },
    strength: { emoji: "💪", color: "#D97706", label: "Strength" },
};

export default function BibleVerseCard({ verse }: BibleVerseCardProps) {
    const [liked, setLiked] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    }, [verse?.verse]);

    const handleShare = async () => {
        if (!verse) return;
        await Share.share({ message: `"${verse.verse}" — ${verse.reference}` });
    };

    if (!verse) return null;

    const normalized = normalizeCategory(verse.category);
    const config = categoryConfig[normalized] || { emoji: "📖", color: "#8854C0", label: verse.category };

    return (
        <Animated.View style={{ opacity: fadeAnim }} className="mx-5 my-6">
            {/* Section Label */}
            <View className="flex-row items-center gap-2 mb-4">
                <Text className="text-lg">{config.emoji}</Text>
                <Text className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                    Daily Verse
                </Text>
                <View className="flex-1 h-px bg-neutral-200 ml-2" />
            </View>

            {/* Quote Block — NO card, just elegant spacing */}
            <View className="relative py-2">
                {/* Large decorative quote mark */}
                <Text className="absolute -top-2 left-0 text-6xl text-[#8854C0] opacity-10 font-serif">"</Text>

                <Text className="text-[17px] text-neutral-800 leading-8 font-medium italic px-2">
                    {verse.verse}
                </Text>

                {/* Large decorative closing quote */}
                <Text className="absolute -bottom-4 right-2 text-6xl text-[#8854C0] opacity-10 font-serif">"</Text>
            </View>

            {/* Reference & Meta */}
            <View className="flex-row items-center justify-between mt-5 px-2">
                <View className="flex-row items-center gap-2">
                    <View
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: `${config.color}15` }}
                    >
                        <Text className="text-[11px] font-bold" style={{ color: config.color }}>
                            {config.label}
                        </Text>
                    </View>
                    <Text className="text-sm font-bold text-[#8854C0]">
                        {verse.reference}
                    </Text>
                </View>

                <View className="flex-row gap-3">
                    <TouchableOpacity onPress={() => setLiked(!liked)} activeOpacity={0.7}>
                        <Feather name="heart" size={18} color={liked ? "#EF4444" : "#C4B5FD"} fill={liked ? "#EF4444" : "none"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare} activeOpacity={0.7}>
                        <Feather name="share-2" size={18} color="#C4B5FD" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Subtle divider line */}
            <View className="mt-5 mx-2 h-px bg-gradient-to-r from-transparent via-[#8854C0]/20 to-transparent" />
        </Animated.View>
    );
}