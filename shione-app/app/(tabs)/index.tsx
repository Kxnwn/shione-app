import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { getHomeData } from "@/api/home.api";
import Greeting from "@/components/HomeTab/Greetings";
import MoodCard from "@/components/HomeTab/MoodCard";
import JournalPreview from "@/components/HomeTab/JournalPreview"
import { SafeAreaView } from "react-native-safe-area-context"
import { ScrollView } from "react-native";

export default function HomeScreen() {
  const [homeData, setHomeData] = useState<any>(null);

  useEffect(() => {
    const loadHomeData = async () => {
      const data = await getHomeData()

      console.log(JSON.stringify(data, null, 2));

      setHomeData(data)
    }

    loadHomeData()
  }, [])


  return(
    <SafeAreaView className="flex-1 bg-[#E6C1F6]">
    <ScrollView
        contentContainerStyle={{
            paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
    >

        {homeData && (
            <>
                <Greeting
                    name={homeData.user.name}
                />

                <MoodCard
                    mood={homeData.mood?.mood} note={homeData.mood?.note}
                />

                <JournalPreview
                    title={homeData.journal?.title}
                    content={homeData.journal?.content}
                />
            </>
        )}

    </ScrollView>
</SafeAreaView>
  )
}