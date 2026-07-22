import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

type JournalProps = {
    content?: string;
    title?: string;
    date?: string;
    onPress?: () => void;
};

export default function JournalPreview({ content, title, date, onPress }: JournalProps) {
    const hasJournal = !!(title && content);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(15)).current;

    const onClickJournal = () => {
        router.replace("/(tabs)/journal")
    }

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();
    }, []);

    const wordCount = content ? content.trim().split(/\s+/).length : 0;

    return (
        <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
            className="mx-5 my-3"
        >
            {/* Left accent bar + content row */}
            <View className="flex-row">
                {/* Purple left border accent */}
                <View className="w-1 rounded-full bg-[#8854C0] mr-4 opacity-60" />

                <View className="flex-1 py-1">
                    {hasJournal ? (
                        <>
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-xs font-bold uppercase tracking-wider text-[#8854C0]">
                                    Latest Entry
                                </Text>
                                <Text className="text-[10px] text-neutral-400">
                                    {date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </Text>
                            </View>

                            <Text className="text-lg font-bold text-neutral-800 mb-1" numberOfLines={1}>
                                {title}
                            </Text>
                            <Text className="text-sm text-neutral-500 leading-5 mb-3" numberOfLines={2}>
                                {content}
                            </Text>

                            <View className="flex-row items-center justify-between">
                                <Text className="text-[11px] text-neutral-400">
                                    {wordCount} words
                                </Text>
                                <TouchableOpacity
                                    onPress={onClickJournal}
                                    activeOpacity={0.7}
                                    className="flex-row items-center gap-1"
                                    
                                >
                                    <Text className="text-sm font-semibold text-[#8854C0]">Read</Text>
                                    <Feather name="arrow-right" size={14} color="#8854C0" />
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        /* Empty State */
                        <View className="py-4">
                            <View className="flex-row items-center gap-2 mb-2">
                                <Feather name="book" size={14} color="#8854C0" />
                                <Text className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                                    Journal
                                </Text>
                            </View>
                            <Text className="text-base font-bold text-neutral-800 mb-1">
                                No journal yet
                            </Text>
                            <Text className="text-sm text-neutral-400 mb-3 leading-5">
                                Write your thoughts and reflect on your day.
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    router.replace('/(tabs)/journal')
                                }}
                                activeOpacity={0.7}
                                className="flex-row items-center gap-1 self-start"
                            >
                                <View className="w-6 h-6 rounded-full bg-[#8854C0]/10 items-center justify-center">
                                    <Feather name="plus" size={12} color="#8854C0" />
                                </View>
                                <Text className="text-sm font-semibold text-[#8854C0]">
                                    Start Journaling
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Animated.View>
    );
}