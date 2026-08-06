import { View, Text, FlatList, TextInput, TouchableOpacity, Platform, Keyboard, KeyboardEvent, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator, Animated } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import NetInfo from '@react-native-community/netinfo';
import { Feather } from '@expo/vector-icons';
import { sendChat, chatHistory } from '@/api/chat.api';
import ChatBubble from '@/components/Chat/ChatBubble';
import { ChatMessage } from '@/types/chat';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const BOTTOM_THRESHOLD = 80;

export default function ChatScreen({}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const isFirstLoad = useRef(true);
  const isAtBottomRef = useRef(true);
  const buttonAnim = useRef(new Animated.Value(0)).current;

  // scrolls to the bottom, then does a second pass shortly after — FlatList's
  // scrollToEnd can fire before newly-added content finishes measuring,
  // especially with multi-line bubbles, so a single call can land short
  const scrollToBottom = (animated: boolean) => {
    flatListRef.current?.scrollToEnd({ animated });
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated });
    }, 100);
  };

  const loadHistory = async () => {
    try {
      const state = await NetInfo.fetch();
      const hasConnection = Boolean(state?.isConnected || state?.isInternetReachable);
      setIsOffline(!hasConnection);

      if (!hasConnection) {
        setMessages([]);
        return;
      }

      const history = await chatHistory();
      setMessages(history);
    } catch (error) {
      console.log(error);
      setIsOffline(true);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: showScrollButton ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showScrollButton]);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e: KeyboardEvent) => {
      const height = Math.max(e.endCoordinates.height - insets.bottom, 0);
      setKeyboardHeight(height);
      if (isAtBottomRef.current) {
        scrollToBottom(true);
      }
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

      const state = await NetInfo.fetch();
      const hasConnection = Boolean(state?.isConnected || state?.isInternetReachable);

      if (!hasConnection) {
        setIsOffline(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "ASSISTANT",
            message: "I can’t chat right now because there’s no internet connection. Please reconnect and try again. 🌐",
            isNew: true,
          },
        ]);
        return;
      }

      const userMessage = message;

      isAtBottomRef.current = true;
      setShowScrollButton(false);

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
      setIsOffline(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "ASSISTANT",
          message: "I can’t reply right now because the connection dropped. Please check your internet and try again. 🌐",
          isNew: true,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleContentSizeChange = () => {
    if (isFirstLoad.current) {
      scrollToBottom(false);
      isFirstLoad.current = false;
      return;
    }

    if (isAtBottomRef.current) {
      scrollToBottom(true);
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const distanceFromBottom =
      contentSize.height - (contentOffset.y + layoutMeasurement.height);

    const atBottom = distanceFromBottom < BOTTOM_THRESHOLD;
    isAtBottomRef.current = atBottom;
    setShowScrollButton(!atBottom);
  };

  const handleScrollButtonPress = () => {
    isAtBottomRef.current = true;
    setShowScrollButton(false);
    scrollToBottom(true);
  };

  const isKeyboardVisible = keyboardHeight > 0;

  return (
    <SafeAreaView className="flex-1 bg-[#FBF8FF]">
      <View className="flex-row items-center justify-between px-5 pt-3 pb-4 bg-[#FBF8FF] border-b border-purple-100">
        <View className="flex-row items-center">
          <View
            className="w-11 h-11 rounded-full bg-white items-center justify-center border border-purple-100 mr-3"
            style={{
              shadowColor: "#8854C0",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Text className="text-[20px]">🌸</Text>
          </View>

          <View>
            <Text className="text-[17px] font-semibold text-neutral-800">
              Shione
            </Text>
            <View className="flex-row items-center mt-0.5">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
              <Text className="text-[12px] text-neutral-400">
                Here whenever you need me
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-1">
        {isLoadingHistory ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" color="#9B6DD6" />
            <Text className="text-[13px] text-purple-300 font-medium mt-3">
              Loading your conversation...
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => <ChatBubble message={item} />}
            className="flex-1 px-4"
            contentContainerStyle={{ paddingBottom: 12, paddingTop: 8 }}
            onContentSizeChange={handleContentSizeChange}
            onScroll={handleScroll}
            scrollEventThrottle={100}
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={
              isThinking ? (
                <ChatBubble
                  message={{ role: "ASSISTANT", message: "", isThinking: true }}
                />
              ) : null
            }
          />
        )}

        {/* Jump-to-latest button — fades in once the user scrolls away
            from the bottom, fades out when they return or tap it */}
        <Animated.View
          pointerEvents={showScrollButton ? "auto" : "none"}
          style={{
            position: "absolute",
            bottom: 16,
            alignSelf: "center",
            opacity: buttonAnim,
            transform: [
              {
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            onPress={handleScrollButtonPress}
            activeOpacity={0.8}
            className="w-10 h-10 rounded-full bg-white items-center justify-center border border-purple-100"
            style={{
              shadowColor: "#8854C0",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Feather name="arrow-down" size={18} color="#9B6DD6" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View
        className="flex-row items-end px-4 py-3 bg-[#FBF8FF] border-t border-purple-100"
        style={{
          marginBottom: isKeyboardVisible ? keyboardHeight + 12 : tabBarHeight + 60,
        }}
      >
        {isOffline ? (
          <View className="flex-1 mr-2 rounded-3xl border border-purple-100 bg-white px-4 py-3">
            <Text className="text-[13px] text-purple-500 font-medium">
              Chat is unavailable offline. Connect to the internet to continue.
            </Text>
          </View>
        ) : (
          <TextInput
            value={message}
            multiline
            onChangeText={setMessage}
            placeholder="Talk to Shione..."
            placeholderTextColor="#B79CE0"
            textAlignVertical="top"
            className="flex-1 bg-white rounded-3xl px-4 py-3 border border-purple-100 text-[15px] text-neutral-700"
            style={{
              maxHeight: 120,
              shadowColor: "#8854C0",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 1,
            }}
          />
        )}

        <TouchableOpacity onPress={handleSend} className="ml-2 rounded-full overflow-hidden" disabled={isOffline}>
          <View className="px-5 py-3 rounded-full" style={{ backgroundColor: isOffline ? "#D8C5F1" : "#9B6DD6" }}>
            <Text className="text-white font-medium">Send</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}