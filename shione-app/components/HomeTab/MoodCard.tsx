import { View, Text, TouchableOpacity, Platform } from "react-native";

type MoodCardProps = {
    mood?: string,
    note?: string,
    onPress: () => void;
};

export default function MoodCard({
    mood, note, onPress
}: MoodCardProps) {

    const button = mood ? "Update Mood" : "Create a Mood"

    const moodNote = note ?? "No note added today.";

    const getMoodEmoji = () => {
        switch (mood) {
            case "Happy": return "😊";
            case "Sad": return "😢";
            case "Calm": return "😌";
            case "Anxious": return "😰";
            default: return "🌸";
        }
    };

    const moodMessage = () => {
        switch (mood) {
            case "Happy": return "Keep nurturing your happiness today.";
            case "Calm": return "Peace begins with a quiet heart.";
            case "Sad": return "It's okay to have difficult days.";
            case "Anxious": return "Take one breath at a time.";
            default: return "How are you feeling today?";
        }
    };

    return (
        <View 
            className="mx-5 my-3 p-5 bg-white border border-neutral-200 rounded-2xl"  
     
        >
           
            <View className="flex-row items-center mb-4">
                <Text className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                    ✨ Mood Today
                </Text>
            </View>

           
            <View className="flex-row items-center mb-5 p-3 bg-neutral-50 rounded-xl">
                <View className="w-12 h-12 bg-white items-center justify-center rounded-full border border-neutral-100">
                    <Text className="text-2xl">{getMoodEmoji()}</Text>
                </View>
                <View className="ml-4 flex-1">
                    <Text className={mood ? "text-xl font-bold text-neutral-900" : "text-base font-medium text-neutral-400 italic"}>
                        {mood ?? "No Mood today"}
                    </Text>
                    <Text className="text-xs text-neutral-500 mt-0.5 leading-4">
                        {moodMessage()}
                    </Text>
                </View>
            </View>
        
           
            <View className="flex-row items-start gap-3 mb-6 p-3 bg-neutral-50 rounded-xl">
                <View className="w-9 h-9 bg-white items-center justify-center rounded-lg border border-neutral-100">
                    <Text className="text-lg">🗒️</Text>
                </View>
                <View className="flex-1 justify-center">
                    <Text className="text-xs font-bold uppercase tracking-wide text-neutral-400">
                        Today's Note
                    </Text>
                    <Text className={`text-sm mt-1 leading-5 ${note ? 'text-neutral-700' : 'text-neutral-400 italic'}`}>
                        {moodNote}
                    </Text>
                </View>
            </View>

            
            <TouchableOpacity 
                onPress={onPress}
                activeOpacity={0.8}
                className="w-full items-center justify-center rounded-xl py-3.5 bg-[#8854C0]"
            >
                <Text className="text-white font-semibold text-base">
                     {button}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
