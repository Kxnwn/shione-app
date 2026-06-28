import { View, Text } from 'react-native'
import { MotiView, MotiText } from 'moti'
import { useEffect } from 'react'
import { router } from 'expo-router'

export default function SplashScreen() {

  useEffect(() => {
    // After 3 seconds, go to onboarding
    const timer = setTimeout(() => {
      router.replace('/onboarding')
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <View className="flex-1 bg-deep items-center justify-center">

      {/* Logo + Name animates in */}
      <MotiView
        from={{ opacity: 0, scale: 0.8, translateY: 20 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ type: 'spring', duration: 1200 }}
        className="items-center"
      >
        {/* Emoji Icon */}
        <MotiText
          from={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 300, damping: 10 }}
          className="text-7xl mb-4"
        >
          💙
        </MotiText>

        {/* App Name */}
        <MotiText
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 500, duration: 800 }}
          className="text-white text-4xl font-bold tracking-widest"
        >
          Shione
        </MotiText>

        {/* Tagline */}
        <MotiText
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 900, duration: 800 }}
          className="text-soft text-sm mt-2 tracking-wider"
        >
          Your calm space
        </MotiText>
      </MotiView>

      {/* Loading dots animate in one by one */}
      <View className="flex-row gap-2 mt-16">
        {[0, 1, 2].map((i) => (
          <MotiView
            key={i}
            from={{ opacity: 0.2, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'timing',
              duration: 600,
              delay: i * 200,
              loop: true,
              repeatReverse: true,
            }}
            className="w-2 h-2 rounded-full bg-soft"
          />
        ))}
      </View>

    </View>
  )
}