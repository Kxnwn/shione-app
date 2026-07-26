import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

type Section = {
    icon: keyof typeof Feather.glyphMap;
    title: string;
    body?: string;
    bullets?: string[];
};

const sections: Section[] = [
    {
        icon: "database",
        title: "Information We Collect",
        body: "We collect information you voluntarily provide while using Shione.",
        bullets: [
            "Name",
            "Email Address",
            "Mood Entries",
            "Journal Entries",
            "Conversations with Shione",
            "Personalized memories created to improve AI responses",
        ],
    },
    {
        icon: "sliders",
        title: "How We Use Your Information",
        body: "Shione uses your information to:",
        bullets: [
            "Personalize AI conversations",
            "Track moods and journals",
            "Improve your overall experience",
            "Remember important preferences and goals",
        ],
    },
    {
        icon: "lock",
        title: "Data Security",
        body: "We value your privacy.",
        bullets: [
            "Passwords are securely hashed before storage",
            "Your personal data is stored securely",
            "We never sell or share your information with third parties",
        ],
    },
    {
        icon: "message-circle",
        title: "AI Conversations",
        body: "Conversations with Shione are stored only to improve personalization. Memories are automatically extracted only from information you voluntarily share.",
    },
    {
        icon: "user-check",
        title: "Your Rights",
        body: "You may:",
        bullets: [
            "Update your profile",
            "Change your password",
            "Delete journals",
            "Delete mood entries",
        ],
    },
    {
        icon: "mail",
        title: "Contact",
        body: "For questions regarding this Privacy Policy, please contact the Shione development team.",
    },
];

const SectionCard = ({ icon, title, body, bullets }: Section) => (
    <View
        className="bg-white rounded-3xl p-5 mb-4 border border-purple-100"
        style={{
            shadowColor: "#8854C0",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 2,
        }}
    >
        <View className="flex-row items-center mb-3">
            <View
                className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: "rgba(136,84,192,0.08)" }}
            >
                <Feather name={icon} size={16} color="#8854C0" />
            </View>
            <Text className="text-[16px] font-bold text-neutral-800 flex-1">
                {title}
            </Text>
        </View>

        {body && (
            <Text className="text-[14px] text-neutral-500 leading-6 mb-2">
                {body}
            </Text>
        )}

        {bullets && (
            <View className="mt-1">
                {bullets.map((item, i) => (
                    <View key={i} className="flex-row items-start mb-2">
                        <View
                            className="w-1.5 h-1.5 rounded-full mt-2 mr-2.5"
                            style={{ backgroundColor: "#B79CE0" }}
                        />
                        <Text className="text-[14px] text-neutral-600 leading-6 flex-1">
                            {item}
                        </Text>
                    </View>
                ))}
            </View>
        )}
    </View>
);

export default function PrivacyPolicyScreen() {
    return (
        <>
            {/* Configures the native Stack header for this screen only —
                no need for a Stack.Screen entry elsewhere; this is the
                standard expo-router pattern for per-screen header options */}
            <Stack.Screen
                options={{
                    title: "Privacy Policy",
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: "#FBF7FF" },
                    headerTitleStyle: { color: "#262626", fontWeight: "700" },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-9 h-9 rounded-full bg-white items-center justify-center mr-2 border border-purple-100"
                        >
                            <Feather name="arrow-left" size={18} color="#8854C0" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <SafeAreaView className="flex-1 bg-[#FBF7FF]" edges={["bottom", "left", "right"]}>
                <ScrollView
                    className="px-5 pt-4"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {/* Intro card */}
                    <View
                        className="rounded-3xl p-5 mb-5 items-center"
                        style={{ backgroundColor: "rgba(136,84,192,0.08)" }}
                    >
                        <View
                            className="w-14 h-14 rounded-full bg-white items-center justify-center mb-3"
                            style={{
                                shadowColor: "#8854C0",
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 2,
                            }}
                        >
                            <Feather name="shield" size={24} color="#8854C0" />
                        </View>
                        <Text className="text-[15px] font-bold text-neutral-800 text-center">
                            Your privacy matters to us
                        </Text>
                        <Text className="text-[12px] text-neutral-400 mt-1">
                            Last updated: July 2026
                        </Text>
                    </View>

                    {sections.map((section) => (
                        <SectionCard key={section.title} {...section} />
                    ))}

                    {/* Footer */}
                    <View className="items-center py-4">
                        <Text className="text-[13px] text-neutral-400">
                            💜 Thank you for trusting Shione
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}