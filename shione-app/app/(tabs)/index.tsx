import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    Text,
    View,
    ScrollView,
    RefreshControl,
    Animated,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { getHomeData } from "@/api/home.api";
import { getStreak } from "@/api/profile.api";
import Greeting from "@/components/HomeTab/Greetings";
import MoodCard from "@/components/HomeTab/MoodCard";
import JournalPreview from "@/components/HomeTab/JournalPreview";
import BibleVerseCard from "@/components/HomeTab/BibleVerseCard";
import Streak from "@/components/HomeTab/Streak";
import MoodBottomSheet from "@/components/Mood/MoodButtomSheet";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

// ─── Types ─────────────────────────────────────────────
type HomeData = {
    user: { name: string };
    mood?: { mood: string; note?: string; createdAt?: string } | null;
    journal?: { title: string; content: string; createdAt?: string } | null;
    verse?: { verse: string; reference: string; category: string } | null;
};

// ─── Premium Section Header ────────────────────────────
const SectionHeader = ({
    icon,
    title,
    action,
    delay = 0,
}: {
    icon: string;
    title: string;
    action?: { label: string; onPress: () => void };
    delay?: number;
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-15)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, delay, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 500, delay, useNativeDriver: true }),
        ]).start();
    }, [delay]);

    return (
        <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}
            className="flex-row items-center justify-between mb-3 px-5"
        >
            <View className="flex-row items-center gap-2.5">
                <Text className="text-lg">{icon}</Text>
                <Text className="text-[13px] font-bold text-neutral-800 uppercase tracking-widest">
                    {title}
                </Text>
            </View>
            {action && (
                <TouchableOpacity onPress={action.onPress} activeOpacity={0.7}>
                    <Text className="text-[13px] font-semibold text-[#8854C0]">
                        {action.label}
                    </Text>
                </TouchableOpacity>
            )}
        </Animated.View>
    );
};

// ─── Mini Stat Pill ────────────────────────────────────
const StatPill = ({
    icon,
    label,
    value,
    color,
    delay,
}: {
    icon: string;
    label: string;
    value: string | number;
    color: string;
    delay: number;
}) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(anim, { toValue: 1, duration: 600, delay, useNativeDriver: true }).start();
    }, [delay]);

    return (
        <Animated.View
            style={{
                opacity: anim,
                transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            }}
            className="flex-row items-center px-4 py-3 rounded-2xl border border-white/50"
        >
            <Text className="text-2xl mr-3">{icon}</Text>
            <View>
                <Text className="text-lg font-bold text-neutral-800">{value}</Text>
                <Text className="text-[11px] text-neutral-500 font-medium">{label}</Text>
            </View>
        </Animated.View>
    );
};

// ─── Main Screen ───────────────────────────────────────
export default function HomeScreen() {
    const [homeData, setHomeData] = useState<HomeData | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [streak, setStreak] = useState(0);
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const animValues = useRef(
        [...Array(6)].map(() => ({
            opacity: new Animated.Value(0),
            translateY: new Animated.Value(25),
            scale: new Animated.Value(0.97),
        }))
    ).current;

    const animateEntry = useCallback(() => {
        animValues.forEach((anim, index) => {
            anim.opacity.setValue(0);
            anim.translateY.setValue(25);
            anim.scale.setValue(0.97);

            Animated.parallel([
                Animated.timing(anim.opacity, { toValue: 1, duration: 700, delay: index * 100, useNativeDriver: true }),
                Animated.timing(anim.translateY, { toValue: 0, duration: 700, delay: index * 100, useNativeDriver: true }),
                Animated.spring(anim.scale, { toValue: 1, friction: 8, tension: 40, delay: index * 100, useNativeDriver: true }),
            ]).start();
        });
    }, [animValues]);

    const loadData = async (isRefresh = false) => {
        if (!isRefresh) setLoading(true);
        try {
            const [home, streakData] = await Promise.all([getHomeData(), getStreak()]);
            setHomeData(home);
            setStreak(streakData?.streak ?? 0);
            setTimeout(animateEntry, 50);
        } catch (error) {
            console.error("Failed to load:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadData(true);
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    if (loading && !homeData) {
        return (
            <SafeAreaView className="flex-1 bg-[#FBF7FF] items-center justify-center">
                <View className="w-16 h-16 rounded-2xl bg-[#8854C0]/10 items-center justify-center mb-4">
                    <Text className="text-4xl">🌸</Text>
                </View>
                <Text className="text-lg font-bold text-neutral-400">Loading...</Text>
            </SafeAreaView>
        );
    }


    const hasMood = !!homeData?.mood?.mood;

    return (
        <SafeAreaView className="flex-1 bg-[#FBF7FF]">
            {/* Soft Background */}
            <View className="absolute top-0 left-0 right-0 h-[500] pointer-events-none">
                <LinearGradient colors={["rgba(136,84,192,0.06)", "transparent"]} className="absolute top-0 left-0 right-0 h-full" />
                <View className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#8854C0]/5" />
                <View className="absolute top-32 -left-16 w-56 h-56 rounded-full bg-[#A78BFA]/5" />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 160 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8854C0" colors={["#8854C0"]} />
                }
            >
                {/*  TAAS NA BAR  */}
                <Animated.View
                    style={{
                        opacity: animValues[0].opacity,
                        transform: [{ translateY: animValues[0].translateY }, { scale: animValues[0].scale }],
                    }}
                    className="px-5 pt-3 pb-1 flex-row items-center justify-between"
                >
                    <View className="px-3 py-1.5 rounded-full bg-white/60 border border-white/40">
                        <Text className="text-[11px] font-bold text-[#8854C0] uppercase tracking-wider">
                            {today}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            router.replace('/(tabs)/profile')
                        }} // TODO: Navigate to profile/settings -TAPOS NA
                        className="w-9 h-9 rounded-full bg-white/60 items-center justify-center border border-white/40"
                    >
                        <Feather name="settings" size={16} color="#8854C0" />
                    </TouchableOpacity>
                </Animated.View>

                {/* ═══ GREETING ═══ */}
                <Animated.View
                    style={{
                        opacity: animValues[0].opacity,
                        transform: [{ translateY: animValues[0].translateY }],
                    }}
                    className="px-5 pt-2 pb-4"
                >
                    {homeData && <Greeting name={homeData.user.name} />}
                </Animated.View>

                {/* ═══ STATS ROW ═══ */}
                <Animated.View
                    style={{
                        opacity: animValues[1].opacity,
                        transform: [{ translateY: animValues[1].translateY }],
                    }}
                    className="px-5 mb-6"
                >
                    <View className="flex-row gap-3">
                        <StatPill
                            icon="🔥"
                            label="Day Streak"
                            value={streak}
                            color="#F97316"
                            delay={100}
                        />
                        <StatPill
                            icon={hasMood ? "✅" : "○"}
                            label="Mood Check"
                            value={hasMood ? "Done" : "Pending"}
                            color={hasMood ? "#10B981" : "#9CA3AF"}
                            delay={200}
                        />
                    </View>
                </Animated.View>

                {/* ═══ MOOD (Hero) ═══ */}
                <Animated.View
                    style={{
                        opacity: animValues[2].opacity,
                        transform: [{ translateY: animValues[2].translateY }, { scale: animValues[2].scale }],
                    }}
                >
                    <SectionHeader icon="💜" title="Your Mood" delay={150} />
                    {homeData && (
                        <MoodCard
                            mood={homeData.mood?.mood}
                            note={homeData.mood?.note}
                            onPress={() => bottomSheetRef.current?.present()}
                        />
                    )}
                </Animated.View>

                {/* ═══ DAILY VERSE ═══ */}
                <Animated.View
                    style={{
                        opacity: animValues[3].opacity,
                        transform: [{ translateY: animValues[3].translateY }],
                    }}
                    className="mt-2"
                >
                    <SectionHeader icon="📖" title="Daily Verse" delay={250} />
                    {homeData && <BibleVerseCard verse={homeData.verse} />}
                </Animated.View>

                {/* ═══ JOURNAL ═══ */}
                <Animated.View
                    style={{
                        opacity: animValues[4].opacity,
                        transform: [{ translateY: animValues[4].translateY }],
                    }}
                    className="mt-2"
                >
                    <SectionHeader
                        icon="📝"
                        title="Journal"
                        delay={350}
                        action={{ label: "See All →", onPress: () => {  router.replace('/(tabs)/journal')} }}
                    />
                    {homeData && (
                        <JournalPreview
                            title={homeData.journal?.title}
                            content={homeData.journal?.content}
                        />
                    )}
                </Animated.View>

               
            </ScrollView>

            {/* Mood Bottom Sheet */}
            <MoodBottomSheet
                ref={bottomSheetRef}
                onMoodSaved={() => loadData()}
            />
        </SafeAreaView>
    );
}