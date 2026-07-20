import { View, Text } from 'react-native'
import { removeToken } from "@/services/storage/auth.storage";
import { router } from 'expo-router';
import PrimaryButton from '@/components/UI/PrimaryButton';
import { removeOnboarding } from '@/services/storage/onboarding.storage';
const handleLogout = async () => {
  try {
    await removeToken()
    await removeOnboarding()
    router.replace("/(auth)/login")
  } catch (error) {
    
  }
}

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-cloud items-center justify-center">
      <Text className="text-deep text-2xl font-bold">👤 Profile</Text>
      <PrimaryButton
  title="Logout"
  onPress={handleLogout}
/>
    </View>
  )
}