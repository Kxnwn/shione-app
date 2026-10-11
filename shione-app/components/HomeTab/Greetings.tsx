
import { View, Text, Image } from "react-native";

type GreetingProps = {
    name: string;
    mood?: string | null;
};

const shioneExpressions = {
    happy: require("@/assets/ShioneEmojies/shioneHappy.png"),
    sad: require("@/assets/ShioneEmojies/shioneSad.png"),
    angry: require("@/assets/ShioneEmojies/shioneAngry.png"),
    anxious: require("@/assets/ShioneEmojies/shioneAnxious.png"),
    calm: require("@/assets/ShioneEmojies/shioneCalm.png"),
    excited: require("@/assets/ShioneEmojies/shioneExcited.png"),
};

export default function Greeting({ name, mood }: GreetingProps) {
    const hour = new Date().getHours();

    let greeting = "";
    let message = "";

    if (hour < 12) {
        greeting = "☀️ Good Morning";
        message = "Let's start today with a peaceful mind.";
    } else if (hour < 18) {
        greeting = "🌤️ Good Afternoon";
        message = "You're doing great. Keep going!";
    } else {
        greeting = "🌙 Good Evening";
        message = "Time to slow down and reflect.";
    }

    const moodKey = mood?.trim().toLowerCase() ?? "happy";

    const shioneImage =
        shioneExpressions[
            moodKey as keyof typeof shioneExpressions
        ] ?? shioneExpressions.happy;

    return (
        <View className="mb-5">
            <View className="flex-row items-center">
                <View className="flex-1 pr-2">
                    <Text className="text-3xl font-semibold text-[#6E5F9E]">
                        {greeting},{" "}
                        <Text className="text-4xl font-bold text-[#8854C0]">
                            {name}
                        </Text>
                    </Text>

                    <Text className="text-base mt-3">
                        {message}
                    </Text>
                </View>

                <Image
                    source={shioneImage}
                    className="w-24 h-24"
                    resizeMode="contain"
                    accessibilityLabel={`Shione feeling ${moodKey}`}
                />
            </View>
        </View>
    );
}
