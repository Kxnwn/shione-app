import { View, Text, TouchableOpacity } from "react-native"

type JournalProps = {
    content?: string,
    title?: string
}

export default function JournalCard({ content, title }: JournalProps) {
    // Determine button text and styling based on content presence
    const hasJournal = !!(title || content)
    const buttonText = hasJournal ? "Continue Reading →" : "Start Journaling →"

    return (
        <View className="mx-6 mt-6 p-5 bg-white border border-neutral-100 rounded-2xl">
            {/* Header section with icon */}
            <View className="flex-row items-center gap-2 mb-3">
                <Text className="text-xl">📔</Text>
                <Text className="text-sm font-bold uppercase tracking-wider text-[#6E5F9E]">
                    Latest Journal
                </Text>
            </View>

            {/* Content Box */}
            <View className="space-y-1.5">
                <Text 
                    className={`text-lg font-bold ${hasJournal ? 'text-neutral-900' : 'text-neutral-400 italic'}`}
                    numberOfLines={1}
                >
                    {title ?? "No journal yet"}
                </Text>

                <Text 
                    className={`text-sm leading-6 ${hasJournal ? 'text-neutral-600' : 'text-neutral-400'}`}
                    numberOfLines={3} 
                    ellipsizeMode="tail"
                >
                    {content ?? "Write your thoughts and reflect on your day."}
                </Text>
            </View>

            {/* Action Button */}
            <TouchableOpacity 
                activeOpacity={0.7}
                className="mt-5 pt-4 border-t border-neutral-100 items-end"
            >
                <Text className="text-sm font-semibold text-[#8854C0]">
                    {buttonText}
                </Text>
            </TouchableOpacity>
        </View>
    )
}
