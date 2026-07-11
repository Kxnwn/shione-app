import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { MotiView } from 'moti'
import { useState } from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import PrimaryButton from '@/components/UI/PrimaryButton'
import InputField from '@/components/UI/InputField'
import { loginUser } from '@/services/auth.service'
import { getToken, saveToken } from '@/services/storage/auth.storage'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
   try {
    const result = await loginUser(email, password)

    await saveToken(result.token)

    const token = await getToken()

    console.log(token)
    
    router.replace("/(tabs)")
  } catch (error) {
    console.log(error)
  }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-cloud"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-4 pt-16 pb-8 justify-center border">

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-6 px-2"
          >
            <Text className="text-mid text-sm font-semibold">← Back</Text>
          </TouchableOpacity>

          {/* Header outside card */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', duration: 800 }}
            className="mb-6 px-2"
          >
            <Text className="text-4xl mb-1">👋</Text>
            <Text className="text-deep text-3xl font-bold mt-2">
              Welcome Back
            </Text>
            <Text className="text-sub text-sm mt-1">
              We missed you. How are you feeling today?
            </Text>
          </MotiView>

          {/* Shadow Cardssssssssss */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', duration: 800, delay: 200 }}
            className="bg-white rounded-3xl px-6 pt-8 pb-8"
            style={{
              shadowColor: '#1B3A5C',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 6,
            }}
          >
            <View className="gap-4">

              {/* Email */}
              <View>
                <Text className="text-deep text-sm font-semibold mb-2 ml-1">
                  Email
                </Text>
                <InputField 
                value={email}
                onChangeText={setEmail}
                placeholder='Enter your email'
                placeholderTextColor="#5E7A8A"
                keyboardType='email-address'
                autoCapitalize='none'
                
              />
              </View>

              {/* Password */}
              <View>
                <Text className="text-deep text-sm font-semibold mb-2 ml-1">
                  Password
                </Text>
                <View>
                  <InputField 
                value={password}
                onChangeText={setPassword}
                placeholder='Enter a Password'
                placeholderTextColor="#5E7A8A"
                secureTextEntry={!showPassword}
                
              />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4"
                  >
                     <Ionicons
                     name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                     size={20}
                     color="#5E7A8A"
                     />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity className="self-end">
                <Text className="text-mid text-sm font-semibold">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <PrimaryButton title='Login'  onPress={handleLogin} />

            </View>
          </MotiView>

          {/* Sign Up Link outside card */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 600, duration: 600 }}
            className="flex-row justify-center items-center mt-6 gap-1"
          >
            <Text className="text-sub text-sm">Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text className="text-mid text-sm font-bold"> Sign Up</Text>
            </TouchableOpacity>
          </MotiView>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}