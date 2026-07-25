import {
    View,
    Text,
    ScrollView,
    Dimensions,
    Animated,
    Easing,
} from "react-native";
import { useState, useEffect, useRef, useCallback } from "react";
import { getMoodAnalytics } from "@/api/analytics.api";
import { MoodAnalytics } from "@/types/analytics";
import { PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const moodConfig = {
    Happy: { emoji: "😊", color: "#FFD54F", gradient: "#FFE082" },
    Calm: { emoji: "😌", color: "#64B5F6", gradient: "#90CAF9" },
    Sad: { emoji: "😢", color: "#5C6BC0", gradient: "#7986CB" },
    Angry: { emoji: "😡", color: "#EF5350", gradient: "#E57373" },
    Excited: { emoji: "🤩", color: "#FF9800", gradient: "#FFB74D" },
    Anxious: { emoji: "😰", color: "#AB47BC", gradient: "#CE93D8" },
} as const;

const AnimatedCard = ({
    children,
    delay = 0,
    style,
}: {
    children: React.ReactNode;
    delay?: number;
    style?: any;
}) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(24)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 700,
                delay,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 700,
                delay,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                {
                    opacity,
                    transform: [{ translateY }],
                },
                style,
            ]}
        >
            {children}
        </Animated.View>
    );
};

export default function AnalyticsScreen() {
    const [analytics, setAnalytics] = useState<MoodAnalytics[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (loading) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.12,
                        duration: 900,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 900,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [loading]);

    const loadAnalytics = async () => {
        try {
            const data = await getMoodAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error("Failed to load analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, []);

    const totalEntries = analytics.reduce(
        (sum, item) => sum + item._count.mood,
        0
    );

    const pieData = analytics.map((item) => {
        const config = moodConfig[item.mood as keyof typeof moodConfig];
        const percentage =
            totalEntries > 0
                ? Math.round((item._count.mood / totalEntries) * 100)
                : 0;

        return {
            value: item._count.mood,
            text: `${percentage}%`,
            color: config.color,
            gradientCenterColor: config.gradient,
            label: item.mood,
            emoji: config.emoji,
            focused: selectedMood === item.mood,
        };
    });

    // ─── Find the top mood (most entries) ─────────────────────
    const topMood =
        pieData.length > 0
            ? pieData.reduce((max, item) =>
                  item.value > max.value ? item : max
              )
            : null;

    const handlePiePress = useCallback((item: any) => {
        setSelectedMood((prev) => (prev === item.label ? null : item.label));
    }, []);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#FBF7FF] items-center justify-center">
                <Animated.View
                    style={{ transform: [{ scale: pulseAnim }] }}
                    className="items-center"
                >
                    <View className="w-20 h-20 rounded-3xl bg-white items-center justify-center mb-5 shadow-sm border border-[#8854C0]/10">
                        <Text className="text-4xl">📊</Text>
                    </View>
                    <Text className="text-neutral-700 text-lg font-bold tracking-tight">
                        Loading Analytics
                    </Text>
                    <Text className="text-neutral-400 text-sm mt-1 font-medium">
                        Crunching your mood data...
                    </Text>
                </Animated.View>
            </SafeAreaView>
        );
    }

    if (analytics.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-[#FBF7FF] items-center justify-center px-8">
                <AnimatedCard>
                    <View className="items-center">
                        <View className="w-24 h-24 rounded-full bg-white items-center justify-center mb-6 shadow-sm border border-[#8854C0]/10">
                            <Text className="text-5xl">🌱</Text>
                        </View>
                        <Text className="text-neutral-800 text-2xl font-bold text-center tracking-tight">
                            No mood data yet
                        </Text>
                        <Text className="text-neutral-400 text-base mt-3 text-center leading-relaxed">
                            Start logging your daily moods to unlock personalized insights and track your emotional journey.
                        </Text>
                    </View>
                </AnimatedCard>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#FBF7FF]">
            {/* Soft ambient background */}
            <View className="absolute top-0 left-0 right-0 h-[500] pointer-events-none">
                <LinearGradient
                    colors={["rgba(136,84,192,0.08)", "transparent"]}
                    className="absolute top-0 left-0 right-0 h-full"
                />
                <View className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#8854C0]/6" />
                <View className="absolute top-40 -left-12 w-48 h-48 rounded-full bg-[#A78BFA]/6" />
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 115 }}
            >
                {/* Header */}
                <AnimatedCard delay={0}>
                    <View className="px-6 pt-8 pb-6">
                        <Text className="text-[#8854C0] text-xs font-bold uppercase tracking-[0.2em] mb-2">
                            Insights
                        </Text>
                        <Text className="text-neutral-900 text-3xl font-bold tracking-tight">
                            Mood Analytics
                        </Text>
                        <View className="flex-row items-center mt-3">
                            <View className="w-2 h-2 rounded-full bg-[#8854C0] mr-2" />
                            <Text className="text-neutral-500 text-sm font-medium">
                                {totalEntries.toLocaleString()} total entries
                            </Text>
                        </View>
                    </View>
                </AnimatedCard>

                {/* Chart Card */}
                <AnimatedCard delay={150}>
                    <View className="mx-5 bg-white rounded-[2rem] p-8 border border-white/60 shadow-lg shadow-[#8854C0]/5">
                        <View className="items-center justify-center">
                            <PieChart
                                data={pieData}
                                donut
                                showGradient
                                radius={width * 0.3}
                                innerRadius={width * 0.19}
                                innerCircleColor="#FBF7FF"
                                innerCircleBorderWidth={0}
                                strokeWidth={4}
                                strokeColor="#ffffff"
                                showText
                                textColor="#334155"
                                textSize={12}
                                fontWeight="bold"
                                showTextBackground
                                textBackgroundColor="#ffffff"
                                textBackgroundRadius={16}
                                focusOnPress
                                toggleFocusOnPress
                                onPress={handlePiePress}
                                centerLabelComponent={() => {
                                    const selected = pieData.find(
                                        (d) => d.focused
                                    );
                                    // Show selected slice, otherwise fallback to top mood
                                    const displayItem =
                                        selected || topMood || pieData[0];
                                    const isTop = !selected && displayItem === topMood;

                                    return (
                                        <View className="items-center justify-center">
                                            {isTop && (
                                                <View className="px-2.5 py-0.5 rounded-full bg-[#8854C0]/10 mb-1">
                                                    <Text className="text-[#8854C0] text-[10px] font-bold uppercase tracking-widest">
                                                        Top Mood
                                                    </Text>
                                                </View>
                                            )}
                                            <Text className="text-4xl mb-1">
                                                {displayItem?.emoji}
                                            </Text>
                                            <Text className="text-neutral-900 text-xl font-bold">
                                                {displayItem?.value}
                                            </Text>
                                            <Text className="text-neutral-400 text-xs font-medium uppercase tracking-wider mt-0.5">
                                                {displayItem?.label}
                                            </Text>
                                        </View>
                                    );
                                }}
                            />
                        </View>

                        {/* Inline legend */}
                        <View className="flex-row flex-wrap justify-center mt-6 gap-x-3 gap-y-2">
                            {pieData.map((item) => (
                                <View
                                    key={item.label}
                                    className="flex-row items-center bg-[#FBF7FF] px-3 py-1.5 rounded-full"
                                >
                                    <View
                                        className="w-2 h-2 rounded-full mr-1.5"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <Text className="text-neutral-500 text-xs font-semibold">
                                        {item.label}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </AnimatedCard>

                {/* Breakdown */}
                <AnimatedCard delay={300}>
                    <View className="mx-5 mt-5 bg-white rounded-[2rem] p-6 border border-white/60 shadow-lg shadow-[#8854C0]/5">
                        <View className="flex-row items-center justify-between mb-5">
                            <View className="flex-row items-center gap-2">
                                <Text className="text-lg">📋</Text>
                                <Text className="text-neutral-800 text-base font-bold tracking-tight">
                                    Breakdown
                                </Text>
                            </View>
                            <View className="px-3 py-1 rounded-full bg-[#8854C0]/8">
                                <Text className="text-[#8854C0] text-xs font-bold">
                                    {pieData.length} moods
                                </Text>
                            </View>
                        </View>

                        {pieData.map((item, index) => (
                            <AnimatedCard
                                key={item.label}
                                delay={400 + index * 80}
                            >
                                <View
                                    className={`flex-row items-center py-3.5 px-4 rounded-2xl mb-2.5 border ${
                                        item.focused
                                            ? "bg-[#8854C0]/5 border-[#8854C0]/15"
                                            : "bg-[#FBF7FF]/60 border-transparent"
                                    }`}
                                >
                                    <View className="flex-row items-center flex-1">
                                        <View
                                            className="w-11 h-11 rounded-2xl items-center justify-center mr-4"
                                            style={{
                                                backgroundColor: `${item.color}15`,
                                                borderWidth: 1,
                                                borderColor: `${item.color}25`,
                                            }}
                                        >
                                            <Text className="text-xl">
                                                {item.emoji}
                                            </Text>
                                        </View>
                                        <View className="flex-1">
                                            <View className="flex-row items-center justify-between mb-2">
                                                <Text className="text-neutral-800 text-sm font-bold">
                                                    {item.label}
                                                </Text>
                                                <Text className="text-neutral-900 text-sm font-bold">
                                                    {item.text}
                                                </Text>
                                            </View>
                                            <View className="flex-row items-center">
                                                <View className="h-2 rounded-full flex-1 mr-3 overflow-hidden bg-neutral-100">
                                                    <View
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${Math.max(
                                                                parseInt(
                                                                    item.text
                                                                ),
                                                                3
                                                            )}%`,
                                                            backgroundColor:
                                                                item.color,
                                                        }}
                                                    />
                                                </View>
                                                <Text className="text-neutral-400 text-xs font-semibold w-14 text-right">
                                                    {item.value}{" "}
                                                    <Text className="text-neutral-300 font-normal">
                                                        entries
                                                    </Text>
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </AnimatedCard>
                        ))}
                    </View>
                </AnimatedCard>

                <View className="h-6" />
            </ScrollView>
        </SafeAreaView>
    );
}