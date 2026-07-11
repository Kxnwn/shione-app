import { View, Text, Dimensions } from "react-native";

const {width} = Dimensions.get("window")

type SlideProps = {
    emoji: string;
    title: string;
    subtitle: string;
};

export default function Slide({
    emoji,
    title,
    subtitle,
}: SlideProps) {
    return (
        <View style={{width}} className="flex-1 justify-center items-center px-8">
            <Text className="text-8xl">{emoji}</Text>

            <Text className="text-4xl font-bold text-[#8854C0] text-center mt-8">
                {title}
            </Text>

            <Text className="text-base text-center text-[#8854C0] opacity-70 mt-4">
                {subtitle}
            </Text>
        </View>
    );
}