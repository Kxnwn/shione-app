import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    Text,
    View,
    ScrollView,
    RefreshControl,
    Animated,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { getHomeData } from "@/api/home.api";
import Greeting from "@/components/HomeTab/Greetings";
import MoodCard from "@/components/HomeTab/MoodCard";
import JournalPreview from "@/components/HomeTab/JournalPreview";
import MoodBottomSheet from "@/components/Mood/MoodButtomSheet";
import BibleVerseCard from "@/components/HomeTab/BibleVerseCard"
import { getStreak } from "@/api/profile.api";
import Streak from "@/components/HomeTab/Streak"

const { width } = Dimensions.get("window");

// ─── Types ─────────────────────────────────────────────
type User = {
    name: string;
};

type MoodData = {
    mood: string;
    note?: string;
    createdAt?: string;
};

type JournalData = {
    title: string;
    content: string;
    createdAt?: string;
};

type BibleData = {
    verse: string,
    reference: string,
    category: string,
}

type HomeData = {
    user: User;
    mood?: MoodData | null;
    journal?: JournalData | null;
    verse?: BibleData | null
};

// ─── Skeleton Loader ───────────────────────────────────
const SkeletonCard = ({ height = 180 }: { height?: number }) => (
    <View
        className="mx-5 my-3 rounded-3xl bg-neutral-100 overflow-hidden"
        style={{ height }}
    >
        <LinearGradient
            colors={["#F5F5F5", "#EBEBEB", "#F5F5F5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="flex-1"
            style={{
                // Shimmer effect via animated gradient could be added here
            }}
        />
    </View>
);

const HomeSkeleton = () => (
    <View className="flex-1">
        <SkeletonCard height={80} />
        <SkeletonCard height={280} />
        <SkeletonCard height={200} />
    </View>
);

// ─── Section Header ────────────────────────────────────
const SectionHeader = ({
    icon,
    title,
    subtitle,
    delay = 0,
}: {
    icon: string;
    title: string;
    subtitle?: string;
    delay?: number;
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-10)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, [delay]);

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
            }}
            className="mx-5 mt-6 mb-2 flex-row items-end justify-between"
        >
            <View className="flex-row items-center gap-2">
                <Text className="text-lg">{icon}</Text>
                <View>
                    <Text className="text-sm font-bold text-neutral-700 uppercase tracking-wider">
                        {title}
                    </Text>
                    {subtitle && (
                        <Text className="text-[11px] text-neutral-400 mt-0.5">
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
        </Animated.View>
    );
};

// ─── Main Screen ───────────────────────────────────────
export default function HomeScreen() {
    const [homeData, setHomeData] = useState<HomeData | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [streak, setStreak] = useState(0)

    // Staggered animation values
    const animValues = useRef(
        [...Array(5)].map(() => ({
            opacity: new Animated.Value(0),
            translateY: new Animated.Value(30),
            scale: new Animated.Value(0.96),
        }))
    ).current;

    const animateEntry = useCallback(() => {
        animValues.forEach((anim, index) => {
            anim.opacity.setValue(0);
            anim.translateY.setValue(30);
            anim.scale.setValue(0.96);

            Animated.parallel([
                Animated.timing(anim.opacity, {
                    toValue: 1,
                    duration: 700,
                    delay: index * 120,
                    useNativeDriver: true,
                }),
                Animated.timing(anim.translateY, {
                    toValue: 0,
                    duration: 700,
                    delay: index * 120,
                    useNativeDriver: true,
                }),
                Animated.spring(anim.scale, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    delay: index * 120,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    }, [animValues]);

    const loadStreak = async (showRefresh = false) => {
        if (!showRefresh) setLoading(true);

        try {
            const data = await getStreak()
            console.log("STREAK", data)
            setStreak(data.streak)
        } catch (error) {
            console.log(error)
        }
    }

    const loadHomeData = async (showRefresh = false) => {
        if (!showRefresh) setLoading(true);
        try {
            const data = await getHomeData();
            setHomeData(data);
            console.log(data)
            // Trigger entry animations after data loads
            setTimeout(animateEntry, 100);
        } catch (error) {
            console.error("Failed to load home data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadHomeData(true);
    }, []);

    useEffect(() => {
        loadHomeData();
        loadStreak();
    }, []);

    // ─── Date Header ─────────────────────────────────────
    const today = new Date();
    const dateString = today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    if (loading && !homeData) {
        return (
            <SafeAreaView className="flex-1 bg-[#FBF7FF]">
                <View className="px-5 pt-6 pb-2">
                    <View className="h-4 w-32 bg-neutral-200 rounded-full mb-2" />
                    <View className="h-8 w-48 bg-neutral-200 rounded-xl" />
                </View>
                <HomeSkeleton />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#FBF7FF]">
            {/* Decorative Background Blobs */}
            <View className="absolute top-0 left-0 right-0 h-96 overflow-hidden pointer-events-none">
                <View
                    className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20"
                    style={{ backgroundColor: "#8854C0" }}
                />
                <View
                    className="absolute top-40 -left-20 w-60 h-60 rounded-full opacity-10"
                    style={{ backgroundColor: "#A78BFA" }}
                />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#8854C0"
                        colors={["#8854C0"]}
                    />
                }
            >
                {/* Top Bar */}
                <Animated.View
                    style={{
                        opacity: animValues[0].opacity,
                        transform: [
                            { translateY: animValues[0].translateY },
                            { scale: animValues[0].scale },
                        ],
                    }}
                    className="px-5 pt-4 pb-2 flex-row items-center justify-between"
                >
                    <View>
                        <Text className="text-xs font-medium text-neutral-400 uppercase tracking-widest">
                            {dateString}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => loadHomeData()}
                        className="w-9 h-9 rounded-full bg-white/60 items-center justify-center border border-white/50"
                        activeOpacity={0.7}
                    >
                        <Feather
                            name="refresh-cw"
                            size={16}
                            color="#8854C0"
                            style={refreshing ? { transform: [{ rotate: "45deg" }] } : undefined}
                        />
                    </TouchableOpacity>
                </Animated.View>

                {/* Greeting */}
                <Animated.View
                    style={{
                        opacity: animValues[0].opacity,
                        transform: [
                            { translateY: animValues[0].translateY },
                            { scale: animValues[0].scale },
                        ],
                    }}
                >
                    {homeData && (
                        <Greeting name={homeData.user.name} />
                    )}
                </Animated.View>

                {/* Mood Section */}
                <Animated.View
                    style={{
                        opacity: animValues[1].opacity,
                        transform: [
                            { translateY: animValues[1].translateY },
                            { scale: animValues[1].scale },
                        ],
                    }}
                >
                    <SectionHeader
                        icon="💜"
                        title="Your Mood"
                        subtitle={homeData?.mood ? "Checked in today" : "Not checked in yet"}
                        delay={100}
                    />
                    {homeData && (
                        <MoodCard
                            mood={homeData.mood?.mood}
                            note={homeData.mood?.note}
                            onPress={() => bottomSheetRef.current?.present()}
                        />
                    )}
                </Animated.View>

                {/* Bible Verse Section */}
                <Animated.View
                    style={{
                        opacity: animValues[2].opacity,
                        transform: [
                            { translateY: animValues[2].translateY },
                            { scale: animValues[2].scale },
                        ],
                    }}
                >
                   
                    {homeData && (
                        <BibleVerseCard  verse={homeData.verse}/>
                    )}
                </Animated.View>

                {/* Journal Section */}
                <Animated.View
                    style={{
                        opacity: animValues[3].opacity,
                        transform: [
                            { translateY: animValues[3].translateY },
                            { scale: animValues[3].scale },
                        ],
                    }}
                >
                    <SectionHeader
                        icon="📝"
                        title="Journal"
                        subtitle="Your latest thoughts"
                        delay={300}
                    />
                    {homeData && (
                        <JournalPreview
                            title={homeData.journal?.title}
                            content={homeData.journal?.content}
                        />
                    )}
                </Animated.View>

                <Streak streak={streak} />

                {/* Quick Actions Footer */}
                <Animated.View
                    style={{
                        opacity: animValues[4].opacity,
                        transform: [
                            { translateY: animValues[4].translateY },
                            { scale: animValues[4].scale },
                        ],
                    }}
                    className="mx-5 mt-6 mb-4"
                >
                    <BlurView
                        intensity={40}
                        tint="light"
                        className="rounded-2xl overflow-hidden border border-white/30"
                    >
                        <View className="p-4 flex-row items-center justify-around">
                            <QuickAction icon="🧘" label="Breathe" onPress={() => {}} />
                            <QuickAction icon="🙏" label="Pray" onPress={() => {}} />
                            <QuickAction icon="🎵" label="Worship" onPress={() => {}} />
                            <QuickAction icon="📊" label="Insights" onPress={() => {}} />
                        </View>
                    </BlurView>
                </Animated.View>
            </ScrollView>

            {/* Bottom Sheet */}
            <MoodBottomSheet
                ref={bottomSheetRef}
                onMoodSaved={() => {
                    loadHomeData();
                }}
            />
        </SafeAreaView>
    );
}

// ─── Quick Action Button ───────────────────────────────
const QuickAction = ({
    icon,
    label,
    onPress,
}: {
    icon: string;
    label: string;
    onPress: () => void;
}) => (
    <TouchableOpacity
        onPress={onPress}
        className="items-center gap-1.5"
        activeOpacity={0.7}
    >
        <View className="w-12 h-12 rounded-2xl bg-white/70 items-center justify-center border border-white/50">
            <Text className="text-xl">{icon}</Text>
        </View>
        <Text className="text-[11px] font-medium text-neutral-500">{label}</Text>
    </TouchableOpacity>
);