import {
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { saveMood } from "@/api/mood.api";
import { TextInput } from "react-native-gesture-handler";

type MoodBottomSheetProps = {
    onMoodSaved: () => void;
};


const MoodBottomSheet = forwardRef<BottomSheetModal, MoodBottomSheetProps>(
    ({ onMoodSaved }, ref) => {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [test, setTest] = useState("");
    const [note, setNote] = useState("");

    const snapPoints = useMemo(() => ["60%"], []);

    const handleSaveMood = async () => {
    try {
        await saveMood(
            selectedMood!,
            note
        );

        onMoodSaved();

        setSelectedMood(null);
        setNote("");

        (ref as React.RefObject<BottomSheetModal>)
            .current?.dismiss();

    } catch (error) {
        console.log(error);
    }
};

    const moods = [
    {
        emoji: "😊",
        mood: "Happy",
    },
    {
        emoji: "😌",
        mood: "Calm",
    },
    {
        emoji: "😢",
        mood: "Sad",
    },
    {
        emoji: "😰",
        mood: "Anxious",
    },
    {
        emoji: "😡",
        mood: "Angry",
    },
    {
        emoji: "😍",
        mood: "Excited",
    },
];

    return (
        <BottomSheetModal
            ref={ref}
            snapPoints={snapPoints}
            enablePanDownToClose
            >
            <BottomSheetView
                style={{
                    flex: 1,
                    padding: 24,
                }}
                 >
         <Text className="text-[26px] font-bold text-center">
            🌸 How are you feeling today?
        </Text>

        <Text className="mt-2 text-center text-gray-500">
             Choose the emotion that best describes you.
        </Text>

        <View className="flex-row flex-wrap justify-center mt-8 gap-4">
    {moods.map((item) => (
       <TouchableOpacity
         key={item.mood}
         onPress={() => setSelectedMood(item.mood)}
        className="w-[90px] h-[95px] rounded-3xl justify-center items-center border-2"
        style={{
        borderColor:
            selectedMood === item.mood
                ? "#8854C0"
                : "#ECECEC",

        backgroundColor:
            selectedMood === item.mood
                ? "#F4ECFF"
                : "#FFFFFF",

        transform: [
            {
                scale:
                    selectedMood === item.mood
                        ? 1.05
                        : 1,
            },
        ],
    }}
>
            <View className="items-center">
   <Text className="text-4xl">
    {item.emoji}
    </Text>

   <Text
        className={`mt-2 text-[13px] font-semibold ${
        selectedMood === item.mood
            ? "text-[#8854C0]"
            : "text-gray-500"
        }`}
        >
    {item.mood}
</Text>
    </View>
        </TouchableOpacity>
    ))}
    </View>
    <Text className="mt-7 text-base font-semibold text-neutral-700">
    💭 Tell me more
    </Text>

<TextInput
    value={note}
    onChangeText={setNote}
    placeholder="Share what's on your mind..."
    multiline
    numberOfLines={4}
    autoCorrect={false}
    autoCapitalize="none"
    textAlignVertical="top"
    className="mt-3 border border-gray-200 rounded-2xl p-4 text-[15px] bg-gray-50"
    style={{
        minHeight: 120,
    }}
/>


<TouchableOpacity
    disabled={!selectedMood}
    onPress={handleSaveMood}
    className="mt-6 py-4 rounded-2xl items-center justify-center"
    style={{
        backgroundColor: selectedMood
            ? "#8854C0"
            : "#D1D5DB",
    }}
>
    <Text className="text-white text-base font-bold">
        Save Mood 🌸
    </Text>
</TouchableOpacity>


            </BottomSheetView>
        </BottomSheetModal>
    );
});

export default MoodBottomSheet;