import { View, Text, TouchableOpacity } from "react-native";
import GlassCard from "../UI/GlassCard";
import { BlurView } from "expo-blur";

type MoodCardProps = {
    mood?: string,
    note?: string
};

export default function MoodCard({
    mood, note
}: MoodCardProps) {

    const moodNote =
    note ??
    "No note added today.";

    const getMoodEmoji = () => {
    switch (mood) {
        case "Happy":
            return "😊";

        case "Sad":
            return "😢";

        case "Calm":
            return "😌";

        case "Anxious":
            return "😰";

        default:
            return "🌸";
    }
};

    const moodMessage = () => {
        switch (mood) {
            case "Happy":
                return "Keep nurturing your happiness today.";

            case "Calm":
                return "Peace begins with a quiet heart.";

            case "Sad":
                return "It's okay to have difficult days.";

            case "Anxious":
                return "Take one breath at a time.";

            default:
                return "How are you feeling today?";
        }
    };

    return (

        <View className="rounded-xl m-5 w-[50%] " style={{
                     backgroundColor: "rgba(255,255,255,0.18)",
                     borderWidth: 1,
                     borderColor: "rgba(255,255,255,0.25)",
                }}>
        
            <Text className="text-lg m-3 font-bold text-[#6E5F9E]">
                🌸 Mood Today
            </Text>

            <Text className="text-5xl text-center mt-5">
                {getMoodEmoji()}
            </Text>

            <Text className="text-center text-2xl mt-4">
                {mood}
            </Text>

            <Text className="text-center text-black mt-">
                {moodMessage()}
            </Text>

            <View
    className="mt-5 rounded-2xl p-4"
>
    <Text className="text-[#6E5F9E] font-semibold">
        💭 Today's Note
    </Text>

    <Text
        className="mt-2 text-[#8854C0] italic leading-6"
        numberOfLines={3}
    >
        {moodNote}
    </Text>
</View>

            <TouchableOpacity
             className="mt-6 self-center border rounded-full mb-3 px-6 py-3" style={{
                borderColor: "rgba(255,255,255,0.25)"
             }}
            >
                <Text className="text-[#8854C0] font-semibold">
                    ✨ Update Mood
                </Text>
            </TouchableOpacity>
        </View>
        
    );
}