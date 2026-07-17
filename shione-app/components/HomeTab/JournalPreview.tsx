import { View, Text, TouchableOpacity } from "react-native"

type JournalProps = {
    content?: string,
    title?: string
}

export default function JournalCard({ content, title }: JournalProps) {
    

    
    const button = content ? "Continue Reading ->" : "Start Journaling ->"

    return (
        <View className="mx-6 mt-8 items-center justify-center">
            <Text className="text-xl font-bold text-[#6E5F9E]">
                📔Latest Journal
            </Text>

            <View className=" h-[2px] w-[50%] mt-3 mb-2 bg-[#E5E5E5]" />

            <Text className="text-lg font-semibold text-[#8854C0]" numberOfLines={1}>
                {title ?? "No journal yet"}
            </Text>

            

            <Text className="text-[#6E5F9E] mt-3 leading-6" numberOfLines={3} ellipsizeMode="tail">
                {content ?? "Write your thoughts and reflect on your day."}
            </Text>

            <View>
                <TouchableOpacity className="mt-5">
                    <Text className="text-[#8854C0] font-semibold">{button}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}