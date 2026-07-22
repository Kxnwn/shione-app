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
} from "react-native";
import { useState } from "react";
import { removeToken } from "@/services/storage/auth.storage";
import { router } from "expo-router";
import { getProfile } from "@/api/profile.api";
import { removeOnboarding } from "@/services/storage/onboarding.storage";
import { useEffect } from "react";

interface ProfileData {
  name: string;
  email: string;
}

export default function ProfileScreen() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);

  // Change Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      const data = await getProfile();
      setProfileData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await removeToken();
      await removeOnboarding();
      router.replace("/(auth)/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!currentPassword) newErrors.current = "Current password is required";
    if (!newPassword) newErrors.new = "New password is required";
    else if (newPassword.length < 8)
      newErrors.new = "Must be at least 8 characters";
    if (newPassword !== confirmPassword)
      newErrors.confirm = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validate()) return;
    setLoading(true);

    // TODO: Call your change password API here
    // await apiChangePassword({ currentPassword, newPassword })

    setTimeout(() => {
      setLoading(false);
      setChangePasswordVisible(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      // TODO: Show success toast/alert
    }, 1000);
  };

  const closeModal = () => {
    setChangePasswordVisible(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  useEffect(() => {
    getData();
  }, []);

  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <ScrollView className="flex-1 bg-cloud">
        {/* Avatar Header */}
        <View className="items-center pt-14 pb-8 px-6">
          <View className="w-24 h-24 rounded-full bg-deep/10 items-center justify-center mb-4">
            <Text className="text-deep text-3xl font-bold">
              {getInitials(profileData?.name)}
            </Text>
          </View>
          <Text className="text-deep text-xl font-bold text-center">
            {profileData?.name || "Loading..."}
          </Text>
          <Text className="text-deep/60 text-sm mt-1 text-center">
            {profileData?.email || ""}
          </Text>
        </View>

        {/* Menu */}
        <View className="px-5 pb-6">
          <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {/* Edit Profile */}
            <TouchableOpacity
              className="flex-row items-center px-5 py-4 border-b border-cloud"
              activeOpacity={0.7}
            >
              <View className="w-9 h-9 rounded-xl bg-cloud items-center justify-center mr-4">
                <Text className="text-base">✏️</Text>
              </View>
              <Text className="text-deep text-base font-medium flex-1">
                Edit Profile
              </Text>
              <Text className="text-deep/30 text-lg">›</Text>
            </TouchableOpacity>

            {/* Change Password - Opens Modal */}
            <TouchableOpacity
              onPress={() => setChangePasswordVisible(true)}
              className="flex-row items-center px-5 py-4"
              activeOpacity={0.7}
            >
              <View className="w-9 h-9 rounded-xl bg-cloud items-center justify-center mr-4">
                <Text className="text-base">🔒</Text>
              </View>
              <Text className="text-deep text-base font-medium flex-1">
                Change Password
              </Text>
              <Text className="text-deep/30 text-lg">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View className="px-5 pb-10">
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-center bg-white rounded-2xl px-5 py-4 shadow-sm"
            activeOpacity={0.7}
          >
            <Text className="text-base">🚪</Text>
            <Text className="text-red-500 text-base font-semibold ml-3">
              Logout
            </Text>
          </TouchableOpacity>
          <Text className="text-center text-deep/30 text-xs mt-6">
            Shione v1.0
          </Text>
        </View>
      </ScrollView>

      {/* ───────── CHANGE PASSWORD MODAL ───────── */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={changePasswordVisible}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end"
        >
          {/* Backdrop */}
          <Pressable className="absolute inset-0 bg-black/40" onPress={closeModal} />

          {/* Modal Sheet */}
          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl">
            {/* Handle bar */}
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />

            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-deep text-xl font-bold">Change Password</Text>
              <TouchableOpacity onPress={closeModal}>
                <Text className="text-deep/40 text-2xl leading-none">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Current Password */}
            <View className="mb-4">
              <Text className="text-deep/70 text-sm font-medium mb-2">
                Current Password
              </Text>
              <View className="flex-row items-center bg-cloud rounded-xl px-4">
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrent}
                  placeholder="Enter current password"
                  placeholderTextColor="#94a3b8"
                  className="flex-1 py-3.5 text-deep text-base"
                />
                <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                  <Text className="text-deep/40 text-sm">
                    {showCurrent ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.current && (
                <Text className="text-red-500 text-xs mt-1.5 ml-1">
                  {errors.current}
                </Text>
              )}
            </View>

            {/* New Password */}
            <View className="mb-4">
              <Text className="text-deep/70 text-sm font-medium mb-2">
                New Password
              </Text>
              <View className="flex-row items-center bg-cloud rounded-xl px-4">
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNew}
                  placeholder="Enter new password"
                  placeholderTextColor="#94a3b8"
                  className="flex-1 py-3.5 text-deep text-base"
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  <Text className="text-deep/40 text-sm">
                    {showNew ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.new && (
                <Text className="text-red-500 text-xs mt-1.5 ml-1">
                  {errors.new}
                </Text>
              )}
            </View>

            {/* Confirm New Password */}
            <View className="mb-6">
              <Text className="text-deep/70 text-sm font-medium mb-2">
                Confirm New Password
              </Text>
              <View className="flex-row items-center bg-cloud rounded-xl px-4">
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  placeholder="Re-enter new password"
                  placeholderTextColor="#94a3b8"
                  className="flex-1 py-3.5 text-deep text-base"
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Text className="text-deep/40 text-sm">
                    {showConfirm ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.confirm && (
                <Text className="text-red-500 text-xs mt-1.5 ml-1">
                  {errors.confirm}
                </Text>
              )}
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={closeModal}
                className="flex-1 bg-cloud py-3.5 rounded-xl items-center"
                activeOpacity={0.7}
              >
                <Text className="text-deep font-semibold text-base">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleChangePassword}
                disabled={loading}
                className={`flex-1 py-3.5 rounded-xl items-center ${
                  loading ? "bg-deep/50" : "bg-deep"
                }`}
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-base">
                  {loading ? "Updating..." : "Update Password"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}