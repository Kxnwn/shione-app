import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Animated,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { removeToken } from "@/services/storage/auth.storage";
import { removeOnboarding } from "@/services/storage/onboarding.storage";
import { changePassword, getProfile } from "@/api/profile.api";

interface ProfileData {
    name: string;
    email: string;
}

// ─── Menu Item Component ───────────────────────────────
const MenuItem = ({
    icon,
    label,
    onPress,
    danger,
    delay,
}: {
    icon: React.ReactNode;
    label: string;
    onPress?: () => void;
    danger?: boolean;
    delay: number;
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(15)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 500, delay, useNativeDriver: true }),
        ]).start();
    }, [delay]);

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.75}
                className="flex-row items-center px-5 py-4 border-b border-neutral-100/50"
            >
                <View
                    className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                    style={{
                        backgroundColor: danger ? "rgba(239,68,68,0.08)" : "rgba(136,84,192,0.08)",
                    }}
                >
                    {icon}
                </View>
                <Text
                    className={`text-base font-medium flex-1 ${danger ? "text-red-500" : "text-neutral-800"}`}
                >
                    {label}
                </Text>
                <Feather name="chevron-right" size={18} color={danger ? "#FCA5A5" : "#D4D4D8"} />
            </TouchableOpacity>
        </Animated.View>
    );
};

// ─── Main Screen ───────────────────────────────────────
export default function ProfileScreen() {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);

    // Form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Entry animations
    const headerAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(headerAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
        Animated.timing(cardAnim, { toValue: 1, duration: 700, delay: 200, useNativeDriver: true }).start();
    }, []);

    const getData = async () => {
        try {
            const data = await getProfile();
            setProfileData(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    try {
                        await removeToken();
                        await removeOnboarding();
                        router.replace("/(auth)/login");
                    } catch (error) {
                        console.log("Logout error:", error);
                    }
                },
            },
        ]);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!currentPassword) newErrors.current = "Current password is required";
        if (!newPassword) newErrors.new = "New password is required";
        else if (newPassword.length < 8) newErrors.new = "Must be at least 8 characters";
        if (!confirmPassword) {
      newErrors.confirm = "Please confirm your password";
      }
        else if (newPassword !== confirmPassword) {
        newErrors.confirm = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChangePassword = async () => {
    // 1. Client-side validation first
    if (!validate()) return; // This sets errors state, which renders below inputs

    setLoading(true);
    
    try {
        await changePassword(currentPassword, newPassword);
        
        // Success
        setLoading(false);
        closeModal();
        Alert.alert('Success!', 'Your password has been updated.');
    } catch (error: any) {
        setLoading(false);
        
        // 2. Show SERVER errors (like "Wrong current password") in the form
        const serverMessage = error.response?.data?.message || "Something went wrong";
        
        // If server says current password is wrong, show it under that field
        if (serverMessage.toLowerCase().includes("current") || 
            serverMessage.toLowerCase().includes("old") ||
            serverMessage.toLowerCase().includes("incorrect")) {
            setErrors((prev) => ({ ...prev, current: serverMessage }));
        } else {
            // Generic error alert for other failures
            Alert.alert('Error', serverMessage);
        }
    }
};

    const closeModal = () => {
        setChangePasswordVisible(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
        setFocusedField(null);
    };

    const getInitials = (name: string = "") => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FBF7FF]">
            {/* Background Decorations */}
            <View className="absolute top-0 left-0 right-0 h-96 pointer-events-none overflow-hidden">
                <LinearGradient colors={["rgba(136,84,192,0.08)", "transparent"]} className="absolute top-0 left-0 right-0 h-full" />
                <View className="absolute -top-10 -right-16 w-64 h-64 rounded-full bg-[#8854C0]/6" />
                <View className="absolute top-20 -left-12 w-48 h-48 rounded-full bg-[#A78BFA]/5" />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* ═══ HEADER / AVATAR ═══ */}
                <Animated.View
                    style={{ opacity: headerAnim, transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}
                    className="items-center pt-10 pb-8 px-6"
                >
                    {/* Avatar with gradient ring */}
                    <View
                        className="p-1 rounded-full mb-5"
                        style={{
                            backgroundColor: "rgba(136,84,192,0.15)",
                        }}
                    >
                        <LinearGradient
                            colors={["#8854C0", "#A78BFA"]}
                            className="w-24 h-24 rounded-full items-center justify-center"
                        >
                            <Text className="text-white text-3xl font-bold">
                                {getInitials(profileData?.name)}
                            </Text>
                        </LinearGradient>
                    </View>

                    <Text className="text-2xl font-bold text-neutral-800 text-center">
                        {profileData?.name || "Loading..."}
                    </Text>
                    <Text className="text-sm text-neutral-400 mt-1 text-center">
                        {profileData?.email || ""}
                    </Text>
                </Animated.View>

                {/* ═══ MENU CARD ═══ */}
                <Animated.View
                    style={{ opacity: cardAnim, transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}
                    className="px-5 pb-6"
                >
                    <BlurView
                        intensity={60}
                        tint="light"
                        className="rounded-3xl overflow-hidden border border-white/40"
                        style={{
                            shadowColor: "#8854C0",
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.08,
                            shadowRadius: 20,
                            elevation: 4,
                        }}
                    >
                        <LinearGradient colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.85)"]}>
                            <MenuItem
                                icon={<Feather name="user" size={18} color="#8854C0" />}
                                label="Edit Profile"
                                delay={100}
                            />
                            <MenuItem
                                icon={<Feather name="lock" size={18} color="#8854C0" />}
                                label="Change Password"
                                onPress={() => setChangePasswordVisible(true)}
                                delay={200}
                            />
                            <MenuItem
                                icon={<Feather name="bell" size={18} color="#8854C0" />}
                                label="Notifications"
                                delay={300}
                            />
                            <MenuItem
                                icon={<Feather name="shield" size={18} color="#8854C0" />}
                                label="Privacy Policy"
                                delay={400}
                            />
                        </LinearGradient>
                    </BlurView>
                </Animated.View>

                {/* ═══ LOGOUT ═══ */}
                <Animated.View
                    style={{ opacity: cardAnim, transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}
                    className="px-5 pb-8"
                >
                    <BlurView
                        intensity={60}
                        tint="light"
                        className="rounded-3xl overflow-hidden border border-gray-200"
                    >
                        <TouchableOpacity
                            onPress={handleLogout}
                            activeOpacity={0.75}
                            className="flex-row items-center justify-center py-4"
                        >
                            <Feather name="log-out" size={18} color="#EF4444" />
                            <Text className="text-red-500 text-base font-semibold ml-2.5">
                                Sign Out
                            </Text>
                        </TouchableOpacity>
                    </BlurView>

                    <Text className="text-center text-neutral-300 text-xs mt-6">
                        Shione v1.0 • Made with 💜
                    </Text>
                </Animated.View>
            </ScrollView>

            {/* ═══ CHANGE PASSWORD MODAL ═══ */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={changePasswordVisible}
                onRequestClose={closeModal}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <Pressable className="absolute inset-0 bg-black/40" onPress={closeModal} />

                    <View className="flex-1 justify-end">
                        <View className="bg-white rounded-t-3xl px-6 pt-5 pb-10">
                            {/* Handle bar */}
                            <View className="w-10 h-1 rounded-full bg-neutral-200 self-center mb-5" />

                            {/* Header */}
                            <View className="flex-row items-center justify-between mb-6">
                                <TouchableOpacity onPress={closeModal} className="w-8 h-8 items-center justify-center">
                                    <Feather name="x" size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                                <Text className="text-lg font-bold text-neutral-800">Change Password</Text>
                                <View className="w-8" />
                            </View>

                            {/* Current Password */}
                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-neutral-600 mb-2 ml-1">
                                    Current Password
                                </Text>
                                <View
                                    className="flex-row items-center rounded-2xl border bg-neutral-50/50 overflow-hidden"
                                    style={{
                                        borderColor: errors.current ? "#FCA5A5" : focusedField === "current" ? "#8854C0" : "#E5E5E5",
                                        borderWidth: focusedField === "current" || errors.current ? 1.5 : 1,
                                    }}
                                >
                                    <View className="pl-4 pr-2">
                                        <Feather
                                            name="lock"
                                            size={16}
                                            color={errors.current ? "#EF4444" : focusedField === "current" ? "#8854C0" : "#A3A3A3"}
                                        />
                                    </View>
                                    <TextInput
                                        value={currentPassword}
                                        onChangeText={(text) => {
                                            setCurrentPassword(text);
                                            setErrors((prev) => ({ ...prev, current: "" }));
                                        }}
                                        secureTextEntry={!showCurrent}
                                        placeholder="Enter current password"
                                        placeholderTextColor="#A3A3A3"
                                        onFocus={() => setFocusedField("current")}
                                        onBlur={() => setFocusedField(null)}
                                        className="flex-1 py-3.5 pr-4 text-neutral-800 text-[15px]"
                                    />
                                    <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} className="px-4">
                                        <Feather name={showCurrent ? "eye-off" : "eye"} size={16} color="#A3A3A3" />
                                    </TouchableOpacity>
                                </View>
                                {errors.current && (
                                    <Text className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.current}</Text>
                                )}
                            </View>

                            {/* New Password */}
                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-neutral-600 mb-2 ml-1">
                                    New Password
                                </Text>
                                <View
                                    className="flex-row items-center rounded-2xl border bg-neutral-50/50 overflow-hidden"
                                    style={{
                                        borderColor: errors.new ? "#FCA5A5" : focusedField === "new" ? "#8854C0" : "#E5E5E5",
                                        borderWidth: focusedField === "new" || errors.new ? 1.5 : 1,
                                    }}
                                >
                                    <View className="pl-4 pr-2">
                                        <Feather
                                            name="key"
                                            size={16}
                                            color={errors.new ? "#EF4444" : focusedField === "new" ? "#8854C0" : "#A3A3A3"}
                                        />
                                    </View>
                                    <TextInput
                                        value={newPassword}
                                        onChangeText={(text) => {
                                            setNewPassword(text);
                                            setErrors((prev) => ({ ...prev, new: "" }));
                                        }}
                                        secureTextEntry={!showNew}
                                        placeholder="Min. 8 characters"
                                        placeholderTextColor="#A3A3A3"
                                        onFocus={() => setFocusedField("new")}
                                        onBlur={() => setFocusedField(null)}
                                        className="flex-1 py-3.5 pr-4 text-neutral-800 text-[15px]"
                                    />
                                    <TouchableOpacity onPress={() => setShowNew(!showNew)} className="px-4">
                                        <Feather name={showNew ? "eye-off" : "eye"} size={16} color="#A3A3A3" />
                                    </TouchableOpacity>
                                </View>
                                {errors.new && (
                                    <Text className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.new}</Text>
                                )}
                            </View>

                            {/* Confirm Password */}
                            <View className="mb-6">
                                <Text className="text-sm font-semibold text-neutral-600 mb-2 ml-1">
                                    Confirm New Password
                                </Text>
                                <View
                                    className="flex-row items-center rounded-2xl border bg-neutral-50/50 overflow-hidden"
                                    style={{
                                        borderColor: errors.confirm ? "#FCA5A5" : focusedField === "confirm" ? "#8854C0" : "#E5E5E5",
                                        borderWidth: focusedField === "confirm" || errors.confirm ? 1.5 : 1,
                                    }}
                                >
                                    <View className="pl-4 pr-2">
                                        <Feather
                                            name="check-circle"
                                            size={16}
                                            color={errors.confirm ? "#EF4444" : focusedField === "confirm" ? "#8854C0" : "#A3A3A3"}
                                        />
                                    </View>
                                    <TextInput
                                        value={confirmPassword}
                                        onChangeText={(text) => {
                                            setConfirmPassword(text);
                                            setErrors((prev) => ({ ...prev, confirm: "" }));
                                        }}
                                        secureTextEntry={!showConfirm}
                                        placeholder="Re-enter new password"
                                        placeholderTextColor="#A3A3A3"
                                        onFocus={() => setFocusedField("confirm")}
                                        onBlur={() => setFocusedField(null)}
                                        className="flex-1 py-3.5 pr-4 text-neutral-800 text-[15px]"
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} className="px-4">
                                        <Feather name={showConfirm ? "eye-off" : "eye"} size={16} color="#A3A3A3" />
                                    </TouchableOpacity>
                                </View>
                                {errors.confirm && (
                                    <Text className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.confirm}</Text>
                                )}
                            </View>

                            {/* Buttons */}
                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    onPress={closeModal}
                                    className="flex-1 py-3.5 rounded-2xl items-center bg-neutral-100"
                                    activeOpacity={0.75}
                                >
                                    <Text className="text-neutral-600 font-semibold text-base">Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleChangePassword}
                                    disabled={loading}
                                    activeOpacity={0.85}
                                    className="flex-1 rounded-2xl items-center justify-center"
                                    style={{
                                        backgroundColor: "#8854C0",
                                        paddingVertical: 14,
                                        opacity: loading ? 0.7 : 1,
                                        shadowColor: "#8854C0",
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 12,
                                        elevation: 4,
                                    }}
                                >
                                    <Text className="text-white font-bold text-base">
                                        {loading ? "Updating..." : "Update"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}