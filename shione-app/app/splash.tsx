import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { getToken } from '@/services/storage/auth.storage';
import { getOnboarding } from '@/services/storage/onboarding.storage';

const checkLogin = async () => {
    try {
        const token = await getToken();
        console.log("TOKEN", token);

        if (token) {
            router.replace("/(tabs)");
            return;
        }

        const hasSeenOnboarding = await getOnboarding();

        if (hasSeenOnboarding) {
            router.replace("/(auth)/login");
            return;
        }

        router.replace("/onboarding");
    } catch (error) {
        console.log(error);
        router.replace("/onboarding");
    }
};

export default function SplashScreen() {
    useEffect(() => {
        const timer = setTimeout(() => {
            checkLogin();
        }, 2500); // Slightly faster (2.5s)

        return () => clearTimeout(timer);
    }, []);

    return (
        <View className="flex-1 bg-[#FBF7FF] items-center justify-center relative overflow-hidden">
            
            {/* Background Decorations */}
            <View className="absolute top-0 left-0 right-0 h-full pointer-events-none">
                <View
                    className="absolute top-20 -right-20 w-72 h-72 rounded-full opacity-30"
                    style={{ backgroundColor: "#E9D5FF" }}
                />
                <View
                    className="absolute bottom-32 -left-16 w-56 h-56 rounded-full opacity-20"
                    style={{ backgroundColor: "#DDD6FE" }}
                />
                <View
                    className="absolute top-60 left-20 w-20 h-20 rounded-full opacity-40"
                    style={{ backgroundColor: "#F5D0FE" }}
                />
            </View>

            {/* Logo Emoji with Pulse */}
            <MotiView
                from={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 1200 }}
            >
                <MotiView
                    from={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ 
                        type: "timing", 
                        duration: 2000, 
                        loop: true 
                    }}
                >
                    <Text className="text-8xl">🌸</Text>
                </MotiView>
            </MotiView>

            {/* App Name */}
            <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "spring", duration: 1000, delay: 400 }}
            >
                <Text className="text-5xl font-bold text-[#8854C0] mt-6 tracking-tight">
                    Shione
                </Text>
            </MotiView>

            {/* Tagline */}
            <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "spring", duration: 1000, delay: 700 }}
            >
                <Text className="text-base text-center text-[#8854C0] opacity-60 mt-3 px-10 leading-5">
                    Helping you care for your mind, every day.
                </Text>
            </MotiView>

            {/* Loading Dots */}
            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1200, duration: 600 }}
                className="absolute bottom-16 flex-row gap-2"
            >
                <MotiView
                    from={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1200, loop: true, delay: 0 }}
                    className="w-2 h-2 rounded-full bg-[#8854C0]"
                />
                <MotiView
                    from={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1200, loop: true, delay: 200 }}
                    className="w-2 h-2 rounded-full bg-[#8854C0]"
                />
                <MotiView
                    from={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1200, loop: true, delay: 400 }}
                    className="w-2 h-2 rounded-full bg-[#8854C0]"
                />
            </MotiView>
        </View>
    );
}