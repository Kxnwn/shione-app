import { View, Text, FlatList, TextInput, TouchableOpacity, Platform, Keyboard, KeyboardEvent } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { sendChat, chatHistory } from '@/api/chat.api';
import ChatBubble from '@/components/Chat/ChatBubble';
import { ChatMessage } from '@/types/chat';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function ChatScreen({}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const isFirstLoad = useRef(true);

  const loadHistory = async () => {
    try {
      const history = await chatHistory();
      setMessages(history);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e: KeyboardEvent) => {
      // subtract the bottom safe-area inset since SafeAreaView already
      // reserves that space — otherwise we'd double up on it
      const height = Math.max(e.endCoordinates.height - insets.bottom, 0);
      setKeyboardHeight(height);
      flatListRef.current?.scrollToEnd({ animated: true });
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [insets.bottom]);

  const handleSend = async () => {
    try {
      if (!message.trim()) return;

      const userMessage = message;

      setMessages((prev) => [
        ...prev,
        { role: "USER", message: userMessage },
      ]);

      setMessage("");
      setIsThinking(true);

      const aiReply = await sendChat(userMessage);

      setMessages((prev) => [
        ...prev,
        { role: "ASSISTANT", message: aiReply, isNew: true },
      ]);
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ASSISTANT",
          message: "I'm sorry... I couldn't respond right now. Please try again in a moment. 🌸",
          isNew: true,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleContentSizeChange = () => {
    flatListRef.current?.scrollToEnd({ animated: !isFirstLoad.current });
    isFirstLoad.current = false;
  };

  const isKeyboardVisible = keyboardHeight > 0;

  return (
    <SafeAreaView className="flex-1 bg-[#FBF8FF]">
      <View className="px-5 pt-2 pb-3">
        <Text className="text-[13px] text-purple-300 font-medium">
          Shione Your Companion
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <ChatBubble message={item} />}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 12 }}
        onContentSizeChange={handleContentSizeChange}
        keyboardShouldPersistTaps="handled"
      />

      {isThinking && (
        <ChatBubble
          message={{ role: "ASSISTANT", message: "", isThinking: true }}
        />
      )}

      <View
        className="flex-row items-center px-4 py-3 bg-[#FBF8FF] border-t border-purple-100"
        style={{
          marginBottom: isKeyboardVisible ? keyboardHeight + 12 : tabBarHeight + 60,
        }}
      >
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Talk to Shione..."
          placeholderTextColor="#B79CE0"
          className="flex-1 bg-white rounded-full px-4 py-3 border border-purple-100 text-[15px] text-neutral-700"
          style={{
            shadowColor: "#8854C0",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
          }}
        />

        <TouchableOpacity onPress={handleSend} className="ml-2 rounded-full overflow-hidden">
          <View className="px-5 py-3 rounded-full" style={{ backgroundColor: "#9B6DD6" }}>
            <Text className="text-white font-medium">Send</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}