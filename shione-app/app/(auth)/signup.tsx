import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { MotiView } from 'moti'
import { useState } from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import PrimaryButton from '@/components/UI/PrimaryButton'
import InputField from '@/components/UI/InputField'

export default function SignupScreen() {
  // State for each input field
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Handle sign up button press
  const handleSignup = () => {
    // For now just go to main app
    // Later we'll connect this to our backend
    router.replace('/(tabs)')
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
      <View className="flex-1 px-4 pt-16 pb-8 justify-center">

        {/* Header outside the card */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', duration: 800 }}
          className="mb-6 px-2"
        >
          <Text className="text-4xl mb-1">Shione</Text>
          <Text className="text-deep text-3xl font-bold mt-2">
            Create Account
          </Text>
          <Text className="text-sub text-sm mt-1">
            Start your wellness journey today
          </Text>
        </MotiView>

        {/* Shadow Card */}
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
          {/* Form Fields */}
          <View className="gap-4">

            {/* Full Name */}
            <View>
              <Text className="text-deep text-sm font-semibold mb-2 ml-1">
                Full Name
              </Text>
              <InputField 
                value={name}
                onChangeText={setName}
                placeholder='Enter your full name'
                placeholderTextColor="#5E7A8A"
              />
            </View>

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
                placeholder='Create a Password'
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

            {/* Sign Up Button */}
            <PrimaryButton title='Sign Up →'  onPress={handleSignup} />

          </View>
        </MotiView>

        {/* Login Link outside card */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 600, duration: 600 }}
          className="flex-row justify-center items-center mt-6 gap-1"
        >
          <Text className="text-sub text-sm">Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="text-mid text-sm font-bold"> Log In</Text>
          </TouchableOpacity>
        </MotiView>

      </View>
    </ScrollView>
  </KeyboardAvoidingView>
)
}