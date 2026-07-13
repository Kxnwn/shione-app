import Slide from "@/components/onboarding/Slide";
import { View, Text, Dimensions } from "react-native";
import { FlatList, TouchableOpacity } from "react-native";
import { useState, useRef } from "react";
import PrimaryButton from "@/components/UI/PrimaryButton";
import { router } from "expo-router";
import { removeToken } from "@/services/storage/auth.storage";
import { saveOnboarding, getOnboarding, removeOnboarding } from "@/services/storage/onboarding.storage";

const handleLogout = async () => {
  try {
    await removeToken();

    router.replace("/(auth)/login");
  } catch (error) {
    console.log(error);
  }
};

const { width } = Dimensions.get("window")

const slides = [
    {
        id: "1",
        emoji: "🌸",
        title: "Welcome to Shione",
        subtitle:
            "Your AI companion for mental wellness, emotional support, and personal growth.",
    },
    {
        id: "2",
        emoji: "💜",
        title: "Talk. Reflect. Heal.",
        subtitle:
            "Chat with your AI companion, journal your thoughts, and track your mood every day.",
    },
    {
        id: "3",
        emoji: "🌱",
        title: "Grow One Day at a Time",
        subtitle:
            "Relax with calming activities, receive uplifting Bible verses, and build healthy habits.",
    },
];



export default function OnboardingScreen() {
    const flatListRef = useRef<FlatList>(null)
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const isLastSlide = currentIndex === slides.length - 1


    const handleNext = async () => {

        try {
             if(!isLastSlide){
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true
            });
        } else {
            await saveOnboarding()
            router.replace("/(auth)/signup")
        }
        } catch (error) {
            console.log
        }
       
    }

    return (
        <View className="flex-1 bg-[#FEFFE1] items-center justify-center">
            <TouchableOpacity
                    onPress={() => router.replace('/(auth)/signup')}
                    className="absolute top-14 right-6 z-10"

            >
                <Text className="text-sub text-l">Skip →</Text>
            </TouchableOpacity>
        <FlatList 
            ref={flatListRef}
            data={slides}
            onScroll={(event) => {
             const result =  Math.round( event.nativeEvent.contentOffset.x / width)
              setCurrentIndex(result)

            }}
            horizontal
            pagingEnabled
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
                <Slide 
                emoji={item.emoji}
                title={item.title}
                subtitle={item.subtitle}
                />
            )}
        />
        <View className="w-full px-6">
        <View className="flex-row justify-center mb-6 items-center">
            {slides.map((slide, index) => (
                <View 
                    key={slide.id}
                    className={`w-3 h-3 rounded-full mx-1 ${ index === currentIndex ? "bg-[#8854C0]" : "bg-[#E6C1F6]"}`}
                />
            ))}

        
        </View>
        <PrimaryButton title={isLastSlide ? 'Get Started 🌱' : 'Next →'} onPress={handleNext} />
        </View>
        </View>
    )
}