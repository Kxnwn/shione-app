import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { MotiView } from "moti";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { registerUser } from "@/services/auth.service";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [focusedField, setFocusedField] = useState<"name" | "email" | "password" | null>(null);

    const handleSignup = async () => {
        try {
            setError("");
            setNameError("");
            setEmailError("");
            setPasswordError("");

            let hasError = false;

            if (name.trim() === "") {
                setNameError("Full name is required");
                hasError = true;
            }

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
            } else if (password.length < 8) {
                setPasswordError("Password must be at least 8 characters");
                hasError = true;
            }

            if (hasError) return;

            setLoading(true);
            const result = await registerUser(name, email, password);
            console.log(result);

            router.replace("/(auth)/login");
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
                {/* Decorative Background */}
                <View className="absolute top-0 left-0 right-0 h-80 overflow-hidden pointer-events-none">
                    <LinearGradient
                        colors={["rgba(136,84,192,0.12)", "rgba(136,84,192,0.02)"]}
                        className="absolute top-0 left-0 right-0 h-full"
                    />
                    <View
                        className="absolute -top-16 -right-16 w-60 h-60 rounded-full"
                        style={{ backgroundColor: "rgba(136,84,192,0.07)" }}
                    />
                    <View
                        className="absolute top-32 -left-12 w-40 h-40 rounded-full"
                        style={{ backgroundColor: "rgba(167,139,250,0.05)" }}
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
                            <Text className="text-3xl">🌱</Text>
                        </View>
                        <Text className="text-neutral-800 text-3xl font-bold">
                            Create Account
                        </Text>
                        <Text className="text-neutral-400 text-base mt-2 leading-5">
                            Begin your journey to a healthier, happier mind.
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

                                {/* Full Name */}
                                <View>
                                    <Text className="text-neutral-700 text-sm font-semibold mb-2 ml-1">
                                        Full Name
                                    </Text>
                                    <View
                                        className="flex-row items-center rounded-2xl border bg-neutral-50/50 overflow-hidden"
                                        style={{
                                            borderColor: nameError
                                                ? "#FCA5A5"
                                                : focusedField === "name"
                                                ? "#8854C0"
                                                : "#E5E5E5",
                                            borderWidth: focusedField === "name" || nameError ? 1.5 : 1,
                                        }}
                                    >
                                        <View className="pl-4 pr-2">
                                            <Feather
                                                name="user"
                                                size={18}
                                                color={nameError ? "#EF4444" : focusedField === "name" ? "#8854C0" : "#A3A3A3"}
                                            />
                                        </View>
                                        <TextInput
                                            value={name}
                                            onChangeText={(text) => {
                                                setName(text);
                                                setNameError("");
                                                setError("");
                                            }}
                                            placeholder="John Doe"
                                            placeholderTextColor="#A3A3A3"
                                            autoCapitalize="words"
                                            onFocus={() => setFocusedField("name")}
                                            onBlur={() => setFocusedField(null)}
                                            className="flex-1 py-3.5 pr-4 text-neutral-800 text-[15px]"
                                        />
                                    </View>
                                    {nameError ? (
                                        <Text className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                                            {nameError}
                                        </Text>
                                    ) : null}
                                </View>

                                {/* Email */}
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
                                                setEmailError("");
                                                setError("");
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

                                {/* Password */}
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
                                                setPasswordError("");
                                                setError("");
                                            }}
                                            placeholder="Min. 8 characters"
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

                                {/* Sign Up Button */}
                                <TouchableOpacity
                                    onPress={handleSignup}
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
                                                Create Account
                                            </Text>
                                            <Feather name="arrow-right" size={18} color="white" />
                                        </>
                                    )}
                                </TouchableOpacity>
                            </LinearGradient>
                        </BlurView>
                    </MotiView>

                    {/* Login Link */}
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 600, duration: 600 }}
                        className="flex-row justify-center items-center mt-8 gap-1"
                    >
                        <Text className="text-neutral-400 text-sm">
                            Already have an account?
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push("/(auth)/login")}
                            activeOpacity={0.7}
                        >
                            <Text className="text-[#8854C0] text-sm font-bold">
                                Sign In
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
                            By signing up, you agree to our Terms & Privacy Policy
                        </Text>
                    </MotiView>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}