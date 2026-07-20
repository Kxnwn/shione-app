import React, { useRef, useEffect } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Animated,
    Dimensions 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { ChevronRight, Sparkles, PenLine } from "lucide-react-native";

type MoodCardProps = {
    mood?: string;
    note?: string;
    onPress: () => void;
};

const { width } = Dimensions.get("window");

const moodConfig: Record<string, { emoji: string; message: string; gradient: [string, string]; accent: string }> = {
    Happy: { 
        emoji: "😊", 
        message: "Keep nurturing your happiness today.", 
        gradient: ["#FEF3C7", "#FDE68A"],
        accent: "#D97706"
    },
    Sad: { 
        emoji: "😢", 
        message: "It's okay to have difficult days. Be gentle with yourself.", 
        gradient: ["#DBEAFE", "#BFDBFE"],
        accent: "#2563EB"
    },
    Calm: { 
        emoji: "😌", 
        message: "Peace begins with a quiet heart.", 
        gradient: ["#D1FAE5", "#A7F3D0"],
        accent: "#059669"
    },
    Anxious: { 
        emoji: "😰", 
        message: "Take one breath at a time. This moment is temporary.", 
        gradient: ["#E0E7FF", "#C7D2FE"],
        accent: "#4F46E5"
    },
};

export default function MoodCard({ mood, note, onPress }: MoodCardProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    const currentMood = mood ? moodConfig[mood] : null;
    const hasContent = !!mood;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
        ]).start();
    }, [mood]);

    return (
        <Animated.View 
            style={{
                opacity: fadeAnim,
                transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                ]
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
                    shadowOpacity: 0.15,
                    shadowRadius: 24,
                    elevation: 8,
                }}
            >
                <LinearGradient
                    colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.7)"]}
                    className="p-5"
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-5">
                        <View className="flex-row items-center gap-2">
                            <View className="w-7 h-7 rounded-full bg-[#8854C0]/10 items-center justify-center">
                                <Sparkles size={14} color="#8854C0" />
                            </View>
                            <Text className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                                Today&apos;s Mood
                            </Text>
                        </View>
                        {hasContent && (
                            <View className="px-2.5 py-1 rounded-full bg-[#8854C0]/10">
                                <Text className="text-[10px] font-bold text-[#8854C0] uppercase tracking-wide">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Main Mood Display */}
                    <View className="flex-row items-center mb-5">
                        {/* Emoji Bubble */}
                        <View 
                            className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                            style={{
                                backgroundColor: currentMood ? `${currentMood.accent}15` : "#F5F5F5",
                                borderWidth: 1.5,
                                borderColor: currentMood ? `${currentMood.accent}30` : "#E5E5E5",
                            }}
                        >
                            <Text className="text-3xl">{currentMood?.emoji ?? "🌸"}</Text>
                        </View>

                        {/* Text Content */}
                        <View className="flex-1">
                            <Text 
                                className={hasContent ? "text-2xl font-bold text-neutral-800" : "text-lg font-medium text-neutral-400"}
                                style={hasContent ? { color: currentMood?.accent } : undefined}
                            >
                                {mood ?? "How are you feeling?"}
                            </Text>
                            <Text className="text-xs text-neutral-500 mt-1 leading-4 pr-2">
                                {currentMood?.message ?? "Take a moment to check in with yourself."}
                            </Text>
                        </View>
                    </View>

                    {/* Note Section - Only show if note exists, otherwise show hint */}
                    {note ? (
                        <View className="mb-5 p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-100">
                            <View className="flex-row items-center gap-1.5 mb-1.5">
                                <PenLine size={12} color="#8854C0" />
                                <Text className="text-[10px] font-bold uppercase tracking-wider text-[#8854C0]">
                                    Journal Note
                                </Text>
                            </View>
                            <Text className="text-sm text-neutral-600 leading-5" numberOfLines={3}>
                                {note}
                            </Text>
                        </View>
                    ) : hasContent ? (
                        <View className="mb-5 p-3 rounded-xl bg-neutral-50/50 border border-dashed border-neutral-200">
                            <Text className="text-xs text-neutral-400 italic text-center">
                                No note added for this mood
                            </Text>
                        </View>
                    ) : null}

                    {/* CTA Button */}
                    <TouchableOpacity 
                        onPress={onPress}
                        activeOpacity={0.85}
                        className="w-full flex-row items-center justify-center rounded-2xl py-4"
                        style={{
                            backgroundColor: hasContent ? "#8854C0" : "#8854C0",
                            shadowColor: "#8854C0",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 12,
                            elevation: 5,
                        }}
                    >
                        <Text className="text-white font-bold text-[15px] mr-2">
                            {hasContent ? "Update Mood" : "Log Your Mood"}
                        </Text>
                        <ChevronRight size={18} color="white" strokeWidth={2.5} />
                    </TouchableOpacity>
                </LinearGradient>
            </BlurView>
        </Animated.View>
    );
}