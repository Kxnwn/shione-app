import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import { MotiView } from 'moti'
import { useRef, useState } from 'react'
import { FlatList } from 'react-native'
import { router } from 'expo-router'

// Get the phone's screen width
const { width } = Dimensions.get('window')

// ── Slide Data ──────────────────────────────────────────
const slides = [
  {
    id: '1',
    emoji: '🧘',
    title: 'Feel heard,\nfeel better',
    subtitle: 'Your AI companion for mental wellness. Talk freely, without judgment.',
  },
  {
    id: '2',
    emoji: '📓',
    title: 'Track your\nmood daily',
    subtitle: 'Log how you feel, journal your thoughts, and watch your progress grow.',
  },
  {
    id: '3',
    emoji: '🌱',
    title: 'Relax and\nrecharge',
    subtitle: 'Breathing exercises, calming games, and Bible verses to lift your spirit.',
  },
]

// ── Single Slide Component ───────────────────────────────
function Slide({ item }: { item: typeof slides[0] }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', duration: 800 }}
      style={{ width }}
      className="items-center justify-center px-8"
    >
      {/* Emoji */}
      <Text className="text-8xl mb-8">{item.emoji}</Text>

      {/* Title */}
      <Text className="text-deep text-4xl font-bold text-center leading-tight mb-4">
        {item.title}
      </Text>

      {/* Subtitle */}
      <Text className="text-sub text-base text-center leading-relaxed">
        {item.subtitle}
      </Text>
    </MotiView>
  )
}

// ── Dot Indicator ────────────────────────────────────────
function Dots({ current }: { current: number }) {
  return (
    <View className="flex-row gap-2 items-center justify-center mt-12">
      {slides.map((_, i) => (
        <MotiView
          key={i}
          animate={{
            width: i === current ? 24 : 8,
            opacity: i === current ? 1 : 0.3,
          }}
          transition={{ type: 'spring', duration: 400 }}
          className="h-2 rounded-full bg-mid"
        />
      ))}
    </View>
  )
}

// ── Main Onboarding Screen ni idol ───────────────────────────────
export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  // Runs every time user swipes to a new slide
  const onScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width)
    setCurrentIndex(index)
  }

  // Next button handler
  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      // Go to next slide
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 })
    } else {
      // Last slide — go to Sign Up
      router.replace('/(auth)/signup')
    }
  }

  const isLastSlide = currentIndex === slides.length - 1

  return (
    <View className="flex-1 bg-cloud justify-center">

      {/* Skip button */}
      <TouchableOpacity
        onPress={() => router.replace('/(auth)/signup')}
        className="absolute top-14 right-6 z-10"
      >
        <Text className="text-sub text-sm">Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Slide item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      {/* Dots + Button */}
      <View className="px-8 pb-16">
        <Dots current={currentIndex} />

        {/* Next / Get Started Button */}
        <MotiView
          animate={{ scale: isLastSlide ? 1.05 : 1 }}
          transition={{ type: 'spring' }}
          className="mt-8"
        >
          <TouchableOpacity
            onPress={handleNext}
            className="bg-mid rounded-full py-4 items-center"
          >
            <Text className="text-white text-base font-bold tracking-wide">
              {isLastSlide ? 'Get Started 🌱' : 'Next →'}
            </Text>
          </TouchableOpacity>
        </MotiView>
      </View>

    </View>
  )
}