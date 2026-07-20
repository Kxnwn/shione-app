// components/onboarding/Slide.tsx
import React from "react";
import { View, Text, Dimensions } from "react-native";
import { MotiView } from "moti";

const { width } = Dimensions.get("window");

type SlideProps = {
    emoji: string;
    title: string;
    subtitle: string;
    color?: string;
};

export default function Slide({ emoji, title, subtitle, color = "#E9D5FF" }: SlideProps) {
    return (
        <View
            className="items-center justify-center px-8"
            style={{ width, paddingTop: 100 }}
        >
            <MotiView
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 800 }}
                className="w-32 h-32 rounded-3xl items-center justify-center mb-8"
                style={{
                    backgroundColor: `${color}60`,
                    borderWidth: 2,
                    borderColor: `${color}90`,
                    shadowColor: color,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.2,
                    shadowRadius: 20,
                    elevation: 5,
                }}
            >
                <Text className="text-6xl">{emoji}</Text>
            </MotiView>

            <Text className="text-3xl font-bold text-neutral-800 text-center mb-3">
                {title}
            </Text>
            <Text className="text-base text-neutral-500 text-center leading-6 px-2">
                {subtitle}
            </Text>
        </View>
    );
}