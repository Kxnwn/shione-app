import React, { useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

type JournalProps = {
    content?: string;
    title?: string;
    date?: string; // optional: e.g. "Jul 20, 2026"
    onPress?: () => void;
};

const { width } = Dimensions.get("window");

export default function JournalCard({ content, title, date, onPress }: JournalProps) {
    const hasJournal = !!(title && content);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const wordCount = content ? content.trim().split(/\s+/).length : 0;

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
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
                    colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.75)"]}
                    className="p-5"
                >
                    {/* Header Row */}
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center gap-2">
                            <View className="w-8 h-8 rounded-xl bg-[#8854C0]/10 items-center justify-center">
                                <Feather name="book-open" size={16} color="#8854C0" />
                            </View>
                            <View>
                                <Text className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                                    Latest Journal
                                </Text>
                                {hasJournal && date && (
                                    <Text className="text-[10px] text-neutral-400 mt-0.5">
                                        {date}
                                    </Text>
                                )}
                            </View>
                        </View>

                        {hasJournal && (
                            <View className="px-2.5 py-1 rounded-full bg-[#8854C0]/8">
                                <Text className="text-[10px] font-bold text-[#8854C0]">
                                    {wordCount} words
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Content Area */}
                    {hasJournal ? (
                        <View className="mb-4">
                            <Text
                                className="text-lg font-bold text-neutral-800 mb-2 leading-tight"
                                numberOfLines={1}
                            >
                                {title}
                            </Text>
                            <View className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-100">
                                <Text
                                    className="text-sm text-neutral-600 leading-6"
                                    numberOfLines={3}
                                    ellipsizeMode="tail"
                                >
                                    {content}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        /* Empty State */
                        <View className="items-center py-6 mb-2">
                            <View className="w-16 h-16 rounded-2xl bg-[#8854C0]/5 items-center justify-center mb-3 border border-[#8854C0]/10">
                                <Feather name="edit-3" size={28} color="#8854C0" />
                            </View>
                            <Text className="text-base font-bold text-neutral-800 mb-1">
                                No journal yet
                            </Text>
                            <Text className="text-sm text-neutral-400 text-center leading-5 px-4">
                                Write your thoughts and reflect on your day.
                            </Text>
                        </View>
                    )}

                    {/* Divider */}
                    <View className="h-px bg-neutral-100 mb-4" />

                    {/* Action Button */}
                    <TouchableOpacity
                        onPress={onPress}
                        activeOpacity={0.8}
                        className="flex-row items-center justify-between"
                    >
                        <View className="flex-row items-center gap-2">
                            <View
                                className="w-8 h-8 rounded-full items-center justify-center"
                                style={{
                                    backgroundColor: hasJournal
                                        ? "rgba(136,84,192,0.1)"
                                        : "rgba(136,84,192,0.08)",
                                }}
                            >
                                <Feather
                                    name={hasJournal ? "book" : "plus"}
                                    size={14}
                                    color="#8854C0"
                                />
                            </View>
                            <Text className="text-sm font-bold text-[#8854C0]">
                                {hasJournal ? "Continue Reading" : "Start Journaling"}
                            </Text>
                        </View>
                        <Feather name="arrow-right" size={18} color="#8854C0" />
                    </TouchableOpacity>
                </LinearGradient>
            </BlurView>
        </Animated.View>
    );
}