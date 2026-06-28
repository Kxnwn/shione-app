import { View, Text, ScrollView, TouchableOpacity, TextInput, Pressable } from 'react-native'
import { MotiView } from 'moti'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { router } from 'expo-router'
import Svg, { Circle } from 'react-native-svg'

// ── Progress Ring Component ──────────────────────────────
function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 8,
}: {
  progress: number
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 7) * circumference

  return (
    <Svg width={size} height={size}>
      {/* Background circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#D9EDF7"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#4A7FA5"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  )
}

// ── Quick Action Button Component ────────────────────────
function QuickAction({
  emoji,
  label,
  onPress,
}: {
  emoji: string
  label: string
  onPress: () => void
}) {
  return (
    <TouchableOpacity onPress={onPress} className="items-center gap-2">
      <MotiView
        from={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 600 }}
        className="bg-white w-16 h-16 rounded-2xl items-center justify-center"
        style={{
          shadowColor: '#1B3A5C',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <Text className="text-3xl">{emoji}</Text>
      </MotiView>
      <Text className="text-sub text-xs font-semibold">{label}</Text>
    </TouchableOpacity>
  )
}

// ── Mood Button Component ────────────────────────────────
function MoodButton({
  emoji,
  label,
  selected,
  onPress,
}: {
  emoji: string
  label: string
  selected: boolean
  onPress: () => void
}) {
  return (
    <TouchableOpacity onPress={onPress} className="items-center gap-1">
      <MotiView
        animate={{
          scale: selected ? 1.2 : 1,
          backgroundColor: selected ? '#4A7FA5' : '#FFFFFF',
        }}
        transition={{ type: 'spring', duration: 300 }}
        className="w-14 h-14 rounded-full items-center justify-center"
        style={{
          shadowColor: '#1B3A5C',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: selected ? 0.2 : 0.06,
          shadowRadius: 8,
          elevation: selected ? 6 : 2,
        }}
      >
        <Text className="text-2xl">{emoji}</Text>
      </MotiView>
      <Text className="text-sub text-xs">{label}</Text>
    </TouchableOpacity>
  )
}

// ── Main Home Screen ─────────────────────────────────────
export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)

  // Dummy data — will come from backend later
  const weeklyProgress = 5 // out of 7 days
  const moodHistory = [
    { day: 'M', emoji: '😊', color: '#6DB8D4' },
    { day: 'T', emoji: '😔', color: '#A8CADE' },
    { day: 'W', emoji: '😰', color: '#4A7FA5' },
    { day: 'T', emoji: '😊', color: '#6DB8D4' },
    { day: 'F', emoji: '😴', color: '#A8CADE' },
    { day: 'S', emoji: null, color: '#D9EDF7' },
    { day: 'S', emoji: null, color: '#D9EDF7' },
  ]

  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😰', label: 'Anxious' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '😡', label: 'Angry' },
  ]

  return (
    <ScrollView
      className="flex-1 bg-cloud"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >

      {/* ── Header ── */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', duration: 800 }}
        className="bg-deep px-6 pt-16 pb-8 rounded-b-3xl"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-soft text-sm">Good morning 👋</Text>
            <Text className="text-white text-2xl font-bold mt-1">
              How are you today?
            </Text>
          </View>
          <TouchableOpacity
            className="bg-mid w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons name="notifications-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </MotiView>

      <View className="px-6 mt-6 gap-6">

        {/* ── Bible Verse Card ── */}
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'spring', duration: 800, delay: 200 }}
          className="bg-mid rounded-3xl p-5"
          style={{
            shadowColor: '#1B3A5C',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <View className="flex-row items-center gap-2 mb-3">
            <Text className="text-xl">📖</Text>
            <Text className="text-white text-xs font-semibold tracking-widest uppercase">
              Verse of the Day
            </Text>
          </View>
          <Text className="text-white text-base leading-relaxed font-medium">
            "For I know the plans I have for you, plans to prosper you and not
            to harm you."
          </Text>
          <Text className="text-mist text-xs mt-2 font-semibold">
            — Jeremiah 29:11
          </Text>
        </MotiView>

        {/* ── Weekly Progress + Streak Row ── */}
        <View className="flex-row gap-4">

          {/* Weekly Progress Ring */}
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 800, delay: 300 }}
            className="bg-white rounded-3xl p-4 flex-1 items-center justify-center"
            style={{
              shadowColor: '#1B3A5C',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <Text className="text-sub text-xs font-semibold uppercase tracking-wider mb-3">
              Weekly
            </Text>
            <View className="items-center justify-center">
              <ProgressRing progress={weeklyProgress} />
              <View className="absolute items-center">
                <Text className="text-deep text-lg font-bold">
                  {weeklyProgress}/7
                </Text>
              </View>
            </View>
            <Text className="text-sub text-xs mt-3 text-center">
              Days checked in
            </Text>
          </MotiView>

          {/* Streak Card */}
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 800, delay: 350 }}
            className="bg-white rounded-3xl p-4 flex-1 items-center justify-center"
            style={{
              shadowColor: '#1B3A5C',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <Text className="text-sub text-xs font-semibold uppercase tracking-wider mb-3">
              Streak
            </Text>
            <Text className="text-5xl">🔥</Text>
            <Text className="text-deep text-2xl font-bold mt-2">7 Days</Text>
            <Text className="text-sub text-xs mt-1 text-center">
              Keep it up!
            </Text>
          </MotiView>

        </View>

        {/* ── Mood History ── */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', duration: 800, delay: 400 }}
          className="bg-white rounded-3xl p-5"
          style={{
            shadowColor: '#1B3A5C',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <Text className="text-deep text-base font-bold mb-4">
            This Week's Mood
          </Text>
          <View className="flex-row justify-between px-1">
            {moodHistory.map((item, index) => (
              <MotiView
                key={index}
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 400 + index * 80, duration: 400 }}
                className="items-center gap-2"
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: item.color }}
                >
                  <Text className="text-lg">
                    {item.emoji ?? '·'}
                  </Text>
                </View>
                <Text className="text-sub text-xs font-semibold">
                  {item.day}
                </Text>
              </MotiView>
            ))}
          </View>
        </MotiView>

        {/* Line Border */}
         <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', duration: 800, delay: 750 }}
          className='h-[2px] w-full bg-soft rounded-lg'
        >

        </MotiView>

        {/* ── AI Chat Prompt Card ── */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', duration: 800, delay: 500 }}
          className="bg-deep rounded-3xl p-5 flex-row items-center justify-between"
          style={{
            shadowColor: '#1B3A5C',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <View className="flex-1 mr-4">
            <Text className="text-white text-base font-bold">
              Want to talk? 💙
            </Text>
            <Text className="text-soft text-xs mt-1 leading-relaxed">
              I'm here to listen. No judgment, just support.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/chat')}
            className="bg-mid rounded-2xl px-4 py-3"
          >
            <Text className="text-white text-xs font-bold">Start →</Text>
          </TouchableOpacity>
        </MotiView>

        {/* ── Daily Breathing Reminder ── */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', duration: 800, delay: 550 }}
          className="bg-mist rounded-3xl p-5 flex-row items-center justify-between"
          style={{
            shadowColor: '#1B3A5C',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View className="flex-row items-center gap-4 flex-1">
            <Text className="text-4xl">🧘</Text>
            <View className="flex-1">
              <Text className="text-deep text-sm font-bold">
                Take a breath today
              </Text>
              <Text className="text-sub text-xs mt-1">
                A 2-minute breathing session can reduce anxiety instantly.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-mid rounded-xl px-3 py-2 ml-2"
          >
            <Text className="text-white text-xs font-bold">Try</Text>
          </TouchableOpacity>
        </MotiView>

        {/* ── Mood Check-in ── */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', duration: 800, delay: 600 }}
          className="bg-white rounded-3xl p-5"
          style={{
            shadowColor: '#1B3A5C',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <Text className="text-deep text-base font-bold mb-4">
            How are you feeling?
          </Text>
          <View className="flex-row justify-between px-2">
            {moods.map((mood) => (
              <MoodButton
                key={mood.label}
                emoji={mood.emoji}
                label={mood.label}
                selected={selectedMood === mood.label}
                onPress={() => setSelectedMood(mood.label)}
              />
            ))}
          </View>
        </MotiView>

        {/* ── Quick Actions ── */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', duration: 800, delay: 650 }}
        >
          <Text className="text-deep text-base font-bold mb-4">
            Quick Actions
          </Text>
          <View className="flex-row justify-between px-2">
            <QuickAction
              emoji="💬"
              label="Chat"
              onPress={() => router.push('/(tabs)/chat')}
            />
            <QuickAction
              emoji="🎮"
              label="Games"
              onPress={() => router.push('/(tabs)/games')}
            />
            <QuickAction
              emoji="📓"
              label="Journal"
              onPress={() => router.push('/(tabs)/journal')}
            />
            <QuickAction
              emoji="🧘"
              label="Breathe"
              onPress={() => router.push('/(tabs)/chat')}
            />
          </View>
        </MotiView>

        {/* Line Border */}
         <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', duration: 800, delay: 750 }}
          className='h-[2px] w-full bg-soft rounded-lg'
        >

        </MotiView>

        {/* Contact Us */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', duration: 800, delay: 750 }}
        >
          <View className='items-center'>
            <Text className='text-sub text-xs font-bold text-soft uppercase'>Contact Us</Text>
            <Text className='text-mid font-bold text-xl'>We're Here to Support you</Text>
            <Text className='text-sub text-s mt-2 text-center'>Whether you have questions, need help getting started, or want to learn more - reach out anyime.</Text>
          </View>


          <View className='rounded-xl bg-white mt-12 p-5 ' style={{
            shadowColor: '#1B3A5C',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 6,
          }}>
            <Text className='text-deep font-bold text-2xl'>Account Details:</Text>
            <Text className='mt-3'>Questions, comments, or need help? Simple fill in the form and we'll be in touch shortly.</Text>
            <View className=' mt-10'>
                <Text><Ionicons name='mail-outline' color="black"/> kenbadiola1@gmail.com</Text>
                <Text className='mt-2'><Ionicons name='call-outline' color="black"/> +63 091232355834</Text>
            </View>

            <View className='mt-10'>
                            <Text className="text-deep text-sm font-semibold mb-2 ml-1">
                              Full Name:
                            </Text>
                            <TextInput
                              placeholder="Enter your full name"
                              placeholderTextColor="#5E7A8A"
                              className="bg-cloud border border-soft rounded-2xl px-4 py-4 text-deep text-base"
                            />
                            <Text className="text-deep text-sm font-semibold mb-2 ml-1">
                              Email:
                            </Text>
                            <TextInput
                              placeholder="Enter your email"
                              placeholderTextColor="#5E7A8A"
                              className="bg-cloud border border-soft rounded-2xl px-4 py-4 text-deep text-base "
                            />
                            <Text className="text-deep text-sm font-semibold mb-2 ml-1">
                              Your Message:
                            </Text>
                            <TextInput
                              placeholder="Tell us what's on you mind...."
                              placeholderTextColor="#5E7A8A"
                              className="bg-cloud border border-soft rounded-2xl px-4 py-4 text-deep text-base h-40"
                              multiline
                              numberOfLines={6}
                              textAlignVertical="top"
                              maxLength={500}
                            />
                             <TouchableOpacity
              
                            className="bg-mid rounded-full py-4 items-center mt-4"
                            >
                              <Text className="text-white text-base font-bold tracking-wide">
                                 Submit 
                            </Text>
            </TouchableOpacity>
              </View>
            

          </View>
        </MotiView>

      </View>
    </ScrollView>
  )
}