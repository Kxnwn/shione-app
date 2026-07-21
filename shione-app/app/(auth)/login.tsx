import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Animated,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { MotiView } from "moti";
import { router } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { loginUser } from "@/services/auth.service";
import { getToken, saveToken } from "@/services/storage/auth.storage";

const { width } = Dimensions.get("window");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleLogin = async () => {
        try {
            setError("");
            setEmailError("");
            setPasswordError("");

            let hasError = false;

            if (email.trim() === "") {
                setEmailError("Email is required");
                hasError = true;
            } else if (!emailRegex.test(email)) {
                setEmailError("Please enter a valid email");
                hasError = true;
            }

            if (password.trim() === "") {
                setPasswordError("Password is required");
                hasError = true;
            }

            if (hasError) return;

            setLoading(true);
            const result = await loginUser(email, password);
            await saveToken(result.token);
            const token = await getToken();
            console.log(token)
            

            router.replace("/(tabs)");
        } catch (error: any) {
            setError(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
            style={{ backgroundColor: "#FBF7FF" }}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Decorative Background Elements */}
                <View className="absolute top-0 left-0 right-0 h-72 overflow-hidden pointer-events-none">
                    <LinearGradient
                        colors={["rgba(136,84,192,0.15)", "rgba(136,84,192,0.02)"]}
                        className="absolute top-0 left-0 right-0 h-full"
                    />
                    <View
                        className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
                        style={{ backgroundColor: "rgba(136,84,192,0.08)" }}
                    />
                    <View
                        className="absolute top-20 -left-16 w-48 h-48 rounded-full"
                        style={{ backgroundColor: "rgba(167,139,250,0.06)" }}
                    />
                </View>

                <View className="flex-1 px-6 pt-14 pb-10 justify-center">
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className="mb-8 w-10 h-10 rounded-full bg-white/80 items-center justify-center border border-neutral-100"
                        style={{
                            shadowColor: "#8854C0",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.08,
                            shadowRadius: 8,
                            elevation: 2,
                        }}
                    >
                        <Feather name="arrow-left" size={20} color="#8854C0" />
                    </TouchableOpacity>

                    {/* Header */}
                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: "spring", duration: 800 }}
                        className="mb-8"
                    >
                        <View className="w-14 h-14 rounded-2xl bg-[#8854C0]/10 items-center justify-center mb-4 border border-[#8854C0]/10">
                            <Text className="text-3xl">🌸</Text>
                        </View>
                        <Text className="text-neutral-800 text-3xl font-bold">
                            Welcome Back
                        </Text>
                        <Text className="text-neutral-400 text-base mt-2 leading-5">
                            Sign in to continue your journey toward peace and mindfulness.
                        </Text>
                    </MotiView>

                    {/* Glassmorphism Card */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: "spring", duration: 800, delay: 200 }}
                    >
                        <BlurView
                            intensity={70}
                            tint="light"
                            className="rounded-3xl overflow-hidden border border-white/50"
                            style={{
                                shadowColor: "#8854C0",
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.1,
                                shadowRadius: 24,
                                elevation: 8,
                            }}
                        >
                            <LinearGradient
                                colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.85)"]}
                                className="p-6 gap-5"
                            >
                                {/* Global Error */}
                                {error ? (
                                    <MotiView
                                        from={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-3.5 rounded-xl bg-red-50 border border-red-100 flex-row items-center gap-2"
                                    >
                                        <Feather name="alert-circle" size={16} color="#EF4444" />
                                        <Text className="text-red-500 text-sm font-medium flex-1">
                                            {error}
                                        </Text>
                                    </MotiView>
                                ) : null}

                                {/* Email Field */}
                                <View>
                                    <Text className="text-neutral-700 text-sm font-semibold mb-2 ml-1">
                                        Email Address
                                    </Text>
                                    <View
                                        className="flex-row items-center rounded-2xl border bg-neutral-50/50 overflow-hidden"
                                        style={{
                                            borderColor: emailError
                                                ? "#FCA5A5"
                                                : focusedField === "email"
                                                ? "#8854C0"
                                                : "#E5E5E5",
                                            borderWidth: focusedField === "email" || emailError ? 1.5 : 1,
                                        }}
                                    >
                                        <View className="pl-4 pr-2">
                                            <Feather
                                                name="mail"
                                                size={18}
                                                color={emailError ? "#EF4444" : focusedField === "email" ? "#8854C0" : "#A3A3A3"}
                                            />
                                        </View>
                                        <TextInput
                                            value={email}
                                            onChangeText={(text) => {
                                                setEmail(text);
                                                setError("");
                                                setEmailError("");
                                            }}
                                            placeholder="name@example.com"
                                            placeholderTextColor="#A3A3A3"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            onFocus={() => setFocusedField("email")}
                                            onBlur={() => setFocusedField(null)}
                                            className="flex-1 py-3.5 pr-4 text-neutral-800 text-[15px]"
                                        />
                                    </View>
                                    {emailError ? (
                                        <Text className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                                            {emailError}
                                        </Text>
                                    ) : null}
                                </View>

                                {/* Password Field */}
                                <View>
                                    <Text className="text-neutral-700 text-sm font-semibold mb-2 ml-1">
                                        Password
                                    </Text>
                                    <View
                                        className="flex-row items-center rounded-2xl border bg-neutral-50/50 overflow-hidden"
                                        style={{
                                            borderColor: passwordError
                                                ? "#FCA5A5"
                                                : focusedField === "password"
                                                ? "#8854C0"
                                                : "#E5E5E5",
                                            borderWidth: focusedField === "password" || passwordError ? 1.5 : 1,
                                        }}
                                    >
                                        <View className="pl-4 pr-2">
                                            <Feather
                                                name="lock"
                                                size={18}
                                                color={passwordError ? "#EF4444" : focusedField === "password" ? "#8854C0" : "#A3A3A3"}
                                            />
                                        </View>
                                        <TextInput
                                            value={password}
                                            onChangeText={(text) => {
                                                setPassword(text);
                                                setError("");
                                                setPasswordError("");
                                            }}
                                            placeholder="Enter your password"
                                            placeholderTextColor="#A3A3A3"
                                            secureTextEntry={!showPassword}
                                            autoCapitalize="none"
                                            onFocus={() => setFocusedField("password")}
                                            onBlur={() => setFocusedField(null)}
                                            className="flex-1 py-3.5 text-neutral-800 text-[15px]"
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowPassword(!showPassword)}
                                            className="px-4"
                                            activeOpacity={0.7}
                                        >
                                            <Feather
                                                name={showPassword ? "eye-off" : "eye"}
                                                size={18}
                                                color="#A3A3A3"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {passwordError ? (
                                        <Text className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                                            {passwordError}
                                        </Text>
                                    ) : null}
                                </View>

                                {/* Forgot Password */}
                                <TouchableOpacity
                                    className="self-end -mt-1"
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-[#8854C0] text-sm font-semibold">
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>

                                {/* Login Button */}
                                <TouchableOpacity
                                    onPress={handleLogin}
                                    disabled={loading}
                                    activeOpacity={0.85}
                                    className="w-full rounded-2xl items-center justify-center flex-row gap-2"
                                    style={{
                                        backgroundColor: "#8854C0",
                                        paddingVertical: 16,
                                        shadowColor: "#8854C0",
                                        shadowOffset: { width: 0, height: 6 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 16,
                                        elevation: 6,
                                        opacity: loading ? 0.8 : 1,
                                    }}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <>
                                            <Text className="text-white text-base font-bold">
                                                Sign In
                                            </Text>
                                            <Feather name="arrow-right" size={18} color="white" />
                                        </>
                                    )}
                                </TouchableOpacity>
                            </LinearGradient>
                        </BlurView>
                    </MotiView>

                    {/* Sign Up Link */}
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 600, duration: 600 }}
                        className="flex-row justify-center items-center mt-8 gap-1"
                    >
                        <Text className="text-neutral-400 text-sm">
                            Don't have an account?
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push("/(auth)/signup")}
                            activeOpacity={0.7}
                        >
                            <Text className="text-[#8854C0] text-sm font-bold">
                                Create one
                            </Text>
                        </TouchableOpacity>
                    </MotiView>

                    {/* Footer */}
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 800, duration: 600 }}
                        className="items-center mt-8"
                    >
                        <Text className="text-neutral-300 text-xs">
                            Your data is safe and encrypted 🔒
                        </Text>
                    </MotiView>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}