import React, { forwardRef, useMemo, useState, useCallback, useRef } from "react";
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetBackdrop,
    BottomSheetTextInput
} from "@gorhom/bottom-sheet";
import {
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { saveMood } from "@/api/mood.api";

type MoodBottomSheetProps = {
    onMoodSaved: () => void;
};

type MoodItem = {
    emoji: string;
    mood: string;
    color: string;
    bgColor: string;
};

const moods: MoodItem[] = [
    { emoji: "😊", mood: "Happy", color: "#D97706", bgColor: "#FEF3C7" },
    { emoji: "😌", mood: "Calm", color: "#059669", bgColor: "#D1FAE5" },
    { emoji: "😢", mood: "Sad", color: "#2563EB", bgColor: "#DBEAFE" },
    { emoji: "😰", mood: "Anxious", color: "#4F46E5", bgColor: "#E0E7FF" },
    { emoji: "😡", mood: "Angry", color: "#DC2626", bgColor: "#FEE2E2" },
    { emoji: "🤩", mood: "Excited", color: "#C026D3", bgColor: "#FAE8FF" },
];

const MoodBottomSheet = forwardRef<BottomSheetModal, MoodBottomSheetProps>(
    ({ onMoodSaved }, ref) => {
        const [selectedMood, setSelectedMood] = useState<string | null>(null);
        const [note, setNote] = useState("");
        const [loading, setLoading] = useState(false);
        const [focusedInput, setFocusedInput] = useState(false);
        
        // Animation values for mood items
        const scaleAnims = useRef(
            moods.map(() => new Animated.Value(1))
        ).current;

        const snapPoints = useMemo(() => ["65%"], []);

        const animateMood = useCallback((index: number, selected: boolean) => {
            Animated.spring(scaleAnims[index], {
                toValue: selected ? 1.12 : 1,
                friction: 6,
                tension: 120,
                useNativeDriver: true,
            }).start();
        }, [scaleAnims]);

        const handleSelectMood = (mood: string, index: number) => {
            // Animate previously selected back to normal if changing
            if (selectedMood) {
                const prevIndex = moods.findIndex(m => m.mood === selectedMood);
                if (prevIndex !== -1) animateMood(prevIndex, false);
            }
            
            setSelectedMood(mood);
            animateMood(index, true);
        };

        const handleSaveMood = async () => {
            if (!selectedMood) return;
            
            try {
                setLoading(true);
                Keyboard.dismiss();
                
                await saveMood(selectedMood, note);
                
                // Reset state
                setSelectedMood(null);
                setNote("");
                
                // Dismiss sheet
                (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
                
                // Notify parent
                onMoodSaved();
            } catch (error) {
                console.error("Save mood error:", error);
            } finally {
                setLoading(false);
            }
        };

        const renderBackdrop = useCallback(
            (props: any) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    opacity={0.5}
                />
            ),
            []
        );

        const selectedMoodData = moods.find(m => m.mood === selectedMood);

        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={snapPoints}
                enablePanDownToClose={!loading}
                enableDismissOnClose
                backdropComponent={renderBackdrop}
                keyboardBehavior="interactive"
                keyboardBlurBehavior="restore"
                handleIndicatorStyle={{
                    backgroundColor: "#D4D4D8",
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                }}
                handleStyle={{
                    backgroundColor: "transparent",
                    paddingTop: 12,
                }}
                backgroundStyle={{
                    backgroundColor: "transparent",
                }}
            >
                <BlurView
                    intensity={80}
                    tint="light"
                    className="flex-1"
                >
                    <LinearGradient
                        colors={["rgba(255,255,255,0.95)", "rgba(250,250,252,0.98)"]}
                        className="flex-1"
                    >
                        <BottomSheetView
                            style={{
                                flex: 1,
                                paddingHorizontal: 24,
                                paddingBottom: Platform.OS === "ios" ? 34 : 24,
                            }}
                        >
                            {/* Header */}
                            <View className="items-center mb-6">
                                <View className="w-10 mt-4 h-10 rounded-full bg-[#8854C0]/10 items-center justify-center mb-3">
                                    <Text className="text-xl">🌸</Text>
                                </View>
                                <Text className="text-2xl font-bold text-neutral-800 text-center">
                                    How are you feeling?
                                </Text>
                                <Text className="mt-1.5 text-sm text-neutral-400 text-center">
                                    Select the emotion that resonates with you right now
                                </Text>
                            </View>

                            {/* Mood Grid */}
                            <View className="flex-row flex-wrap justify-between mb-6">
                                {moods.map((item, index) => {
                                    const isSelected = selectedMood === item.mood;
                                    
                                    return (
                                        <Animated.View
                                            key={item.mood}
                                            style={{
                                                transform: [{ scale: scaleAnims[index] }],
                                                width: "30%",
                                                marginBottom: 12,
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={() => handleSelectMood(item.mood, index)}
                                                activeOpacity={0.8}
                                                className="rounded-2xl items-center justify-center py-4 border"
                                                style={{
                                                    backgroundColor: isSelected 
                                                        ? item.bgColor 
                                                        : "rgba(255,255,255,0.8)",
                                                    borderColor: isSelected 
                                                        ? item.color 
                                                        : "rgba(229,229,229,0.8)",
                                                    borderWidth: isSelected ? 2 : 1,
                                                    shadowColor: isSelected ? item.color : "#000",
                                                    shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
                                                    shadowOpacity: isSelected ? 0.15 : 0.05,
                                                    shadowRadius: isSelected ? 12 : 4,
                                                    elevation: isSelected ? 4 : 1,
                                                }}
                                            >
                                                <Text className="text-3xl mb-2">
                                                    {item.emoji}
                                                </Text>
                                                <Text
                                                    className="text-[13px] font-semibold"
                                                    style={{
                                                        color: isSelected ? item.color : "#737373",
                                                    }}
                                                >
                                                    {item.mood}
                                                </Text>
                                                
                                                {/* Selection Indicator */}
                                                {isSelected && (
                                                    <View 
                                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full items-center justify-center"
                                                        style={{ backgroundColor: item.color }}
                                                    >
                                                        <Feather name="check" size={12} color="white" />
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        </Animated.View>
                                    );
                                })}
                            </View>

                            {/* Note Section */}
                            <View className="mb-4">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <Feather name="edit-3" size={14} color="#8854C0" />
                                    <Text className="text-sm font-bold text-neutral-700">
                                        Add a Note
                                    </Text>
                                </View>
                                
                                <View
                                    className="rounded-2xl border overflow-hidden"
                                    style={{
                                        borderColor: focusedInput ? "#8854C0" : "#E5E5E5",
                                        borderWidth: focusedInput ? 1.5 : 1,
                                        backgroundColor: focusedInput ? "rgba(136,84,192,0.03)" : "#FAFAFA",
                                    }}
                                >
                                    <BottomSheetTextInput
                                        value={note}
                                        onChangeText={setNote}
                                        placeholder="What's on your mind? (optional)"
                                        placeholderTextColor="#A3A3A3"
                                        multiline
                                        maxLength={280}
                                        textAlignVertical="top"
                                        onFocus={() => setFocusedInput(true)}
                                        onBlur={() => setFocusedInput(false)}
                                        className="p-4 text-[15px] text-neutral-700 leading-5"
                                        style={{
                                            minHeight: 100,
                                            maxHeight: 140,
                                        }}
                                    />
                                    <View className="flex-row justify-end px-3 pb-2">
                                        <Text className="text-[10px] text-neutral-400">
                                            {note.length}/280
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Selected Mood Preview */}
                            {selectedMoodData && (
                                <View 
                                    className="mb-4 py-3 px-4 rounded-xl flex-row items-center justify-center gap-2"
                                    style={{ backgroundColor: `${selectedMoodData.color}12` }}
                                >
                                    <Text className="text-lg">{selectedMoodData.emoji}</Text>
                                    <Text 
                                        className="text-sm font-semibold"
                                        style={{ color: selectedMoodData.color }}
                                    >
                                        Feeling {selectedMoodData.mood}
                                    </Text>
                                </View>
                            )}

                            {/* Save Button */}
                            <TouchableOpacity
                                disabled={!selectedMood || loading}
                                onPress={handleSaveMood}
                                activeOpacity={0.85}
                                className="w-full rounded-2xl items-center justify-center flex-row gap-2"
                                style={{
                                    backgroundColor: selectedMood ? "#8854C0" : "#E5E5E5",
                                    paddingVertical: 16,
                                    shadowColor: selectedMood ? "#8854C0" : "transparent",
                                    shadowOffset: { width: 0, height: 6 },
                                    shadowOpacity: selectedMood ? 0.3 : 0,
                                    shadowRadius: 16,
                                    elevation: selectedMood ? 6 : 0,
                                }}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <>
                                        <Text className="text-white text-base font-bold">
                                            Save Mood
                                        </Text>
                                        <Text className="text-white text-base">🌸</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </BottomSheetView>
                    </LinearGradient>
                </BlurView>
            </BottomSheetModal>
        );
    }
);

MoodBottomSheet.displayName = "MoodBottomSheet";

export default MoodBottomSheet;