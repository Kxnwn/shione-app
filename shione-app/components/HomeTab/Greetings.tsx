import { View, Text } from "react-native";

type GreetingProps = {
    name: string;
};

export default function Greeting({ name }: GreetingProps) {
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

    return (
        <View className="px-6 pt-14 mb-5">
            <Text className="text-3xl font-semibold text-[#6E5F9E]">
                {greeting},
            </Text>

            <Text className="text-5xl font-bold text-[#8854C0] mt-1">
                {name}
            </Text>

            <Text className="text-base mt-3">
                {message}
            </Text>
        </View>
    );
}