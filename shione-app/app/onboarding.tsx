import React, { useState, useRef, useCallback } from "react";
import {
    View,
    Text,
    Dimensions,
    FlatList,
    TouchableOpacity,
    type ViewToken,
} from "react-native";
import { MotiView } from "moti";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Slide from "@/components/onboarding/Slide";
import { saveOnboarding } from "@/services/storage/onboarding.storage";

const { width } = Dimensions.get("window");

type SlideData = {
    id: string;
    emoji: string;
    title: string;
    subtitle: string;
    color: string;
};

const slides: SlideData[] = [
    {
        id: "1",
        emoji: "🌸",
        title: "Welcome to Shione",
        subtitle: "Your AI companion for mental wellness, emotional support, and personal growth.",
        color: "#F5D0FE",
    },
    {
        id: "2",
        emoji: "💜",
        title: "Talk. Reflect. Heal.",
        subtitle: "Chat with your AI companion, journal your thoughts, and track your mood every day.",
        color: "#DDD6FE",
    },
    {
        id: "3",
        emoji: "🌱",
        title: "Grow One Day at a Time",
        subtitle: "Relax with calming activities, receive uplifting Bible verses, and build healthy habits.",
        color: "#BBF7D0",
    },
];

export default function OnboardingScreen() {
    const flatListRef = useRef<FlatList<SlideData>>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isLastSlide = currentIndex === slides.length - 1;

    // ✅ This is the reliable way to track current slide
    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems[0]?.index != null) {
                setCurrentIndex(viewableItems[0].index);
            }
        },
        []
    );

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const handleNext = async () => {
        try {
            if (!isLastSlide) {
                flatListRef.current?.scrollToIndex({
                    index: currentIndex + 1,
                    animated: true,
                });
            } else {
                await saveOnboarding();
                router.replace("/(auth)/signup");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSkip = async () => {
        try {
            await saveOnboarding();
            router.replace("/(auth)/signup");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View className="flex-1" style={{ backgroundColor: "#FBF7FF" }}>
            {/* Background Decorations */}
            <View className="absolute top-0 left-0 right-0 h-full overflow-hidden pointer-events-none">
                <LinearGradient
                    colors={["rgba(136,84,192,0.08)", "transparent"]}
                    className="absolute top-0 left-0 right-0 h-96"
                />
                <View
                    className="absolute top-20 -right-16 w-64 h-64 rounded-full"
                    style={{ backgroundColor: "rgba(136,84,192,0.06)" }}
                />
                <View
                    className="absolute bottom-40 -left-10 w-48 h-48 rounded-full"
                    style={{ backgroundColor: "rgba(167,139,250,0.05)" }}
                />
            </View>

            {/* Skip Button */}
            <MotiView
                from={{ opacity: 0, translateX: 20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 400 }}
                className="absolute top-14 right-6 z-10"
            >
                <TouchableOpacity
                    onPress={handleSkip}
                    activeOpacity={0.8}
                    className="px-5 py-2.5 rounded-full flex-row items-center gap-1.5"
                    style={{
                        backgroundColor: "rgba(255,255,255,0.8)",
                        borderWidth: 1,
                        borderColor: "rgba(136,84,192,0.15)",
                    }}
                >
                    <Text className="text-sm font-semibold text-[#8854C0]">
                        Skip
                    </Text>
                    <Feather name="arrow-right" size={14} color="#8854C0" />
                </TouchableOpacity>
            </MotiView>

            {/* Slides */}
            <FlatList
                ref={flatListRef}
                data={slides}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                scrollEventThrottle={16}
                decelerationRate="fast"
                renderItem={({ item }) => (
                    <Slide
                        emoji={item.emoji}
                        title={item.title}
                        subtitle={item.subtitle}
                        color={item.color}
                    />
                )}
            />

            {/* Bottom Controls */}
            <View className="absolute bottom-0 left-0 right-0 px-8 pb-12 pt-8">
                <LinearGradient
                    colors={["transparent", "rgba(251,247,255,0.95)", "#FBF7FF"]}
                    className="absolute -top-16 left-0 right-0 h-24 pointer-events-none"
                />

                {/* Pagination Dots */}
                <View className="flex-row justify-center items-center mb-6 gap-2">
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                                width: index === currentIndex ? 28 : 8,
                                backgroundColor: index === currentIndex ? "#8854C0" : "#D8B4FE",
                                opacity: index === currentIndex ? 1 : 0.5,
                            }}
                        />
                    ))}
                </View>

                {/* Action Button */}
                <MotiView
                    key={isLastSlide ? "start" : "next"}
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", duration: 400 }}
                >
                    <TouchableOpacity
                        onPress={handleNext}
                        activeOpacity={0.85}
                        className="w-full rounded-2xl items-center justify-center flex-row gap-2"
                        style={{
                            backgroundColor: "#8854C0",
                            paddingVertical: 16,
                            shadowColor: "#8854C0",
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.3,
                            shadowRadius: 16,
                            elevation: 6,
                        }}
                    >
                        <Text className="text-white text-base font-bold">
                            {isLastSlide ? "Get Started" : "Continue"}
                        </Text>
                        <Feather
                            name={isLastSlide ? "check" : "arrow-right"}
                            size={18}
                            color="white"
                        />
                    </TouchableOpacity>
                </MotiView>
            </View>
        </View>
    );
}