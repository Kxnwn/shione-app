import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChatMessage } from "@/types/chat";
import ThinkingBubble from "./ThinkingBubble";
import TypewriterText from "./Typewriter";

interface ChatBubbleProps {
  message: ChatMessage;
}

const markdownStyle = {
  body: { color: "#3F3355", fontSize: 15, lineHeight: 22 },
  strong: { color: "#5B3E91", fontWeight: "bold" },
  bullet_list: { color: "#3F3355" },
  list_item: { color: "#3F3355" },
  paragraph: { color: "#3F3355", marginTop: 2, marginBottom: 8 },
  blockquote: { borderLeftColor: "#B79CE0", borderLeftWidth: 3, paddingLeft: 10 },
};

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "USER";

  if (message.isThinking) {
    return <ThinkingBubble />;
  }

  return (
    <View className={isUser ? "items-end" : "items-start"} style={{ marginVertical: 6 }}>
      {!isUser && (
        <Text className="text-[11px] text-neutral-400 font-medium mb-1 ml-12">
          Shione
        </Text>
      )}

      <View className="flex-row items-end gap-2 max-w-[85%]">
        {!isUser && (
          <View className="w-7 h-7 rounded-full bg-[#8854C0]/10 items-center justify-center mb-1 border border-[#8854C0]/10">
            <Text className="text-sm">🌸</Text>
          </View>
        )}

        {isUser ? (
          <LinearGradient
            colors={["#9B6DD6", "#C4A8F0"]}
            className="px-4 py-3"
            style={{
              shadowColor: "#8854C0",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 3,
              borderRadius: 18,
              borderBottomRightRadius: 6,
            }}
          >
            <Text className="text-white text-[15px] leading-5">
              {message.message}
            </Text>
          </LinearGradient>
        ) : (
          <View
            className="px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-purple-100"
            style={{
              shadowColor: "#8854C0",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {/* history messages (isNew undefined) render instantly, live replies type out */}
            <TypewriterText
              text={message.message}
              animate={!!message.isNew}
              markdownStyle={markdownStyle}
            />
          </View>
        )}
      </View>

      <Text className="text-[10px] text-neutral-300 mt-1 mr-1 ml-11">
        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </Text>
    </View>
  );
}