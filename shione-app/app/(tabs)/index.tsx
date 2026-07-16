import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { getHomeData } from "@/api/home.api";

export default function HomeScreen() {
  const [homeData, setHomeData] = useState<any>(null);

  useEffect(() => {
    const loadHomeData = async () => {
      const data = await getHomeData()

      console.log(data)

      setHomeData(data)
    }

    loadHomeData()
  }, [])


  return(
    <View className="flex-1 items-center justify-center">
        <Text>Good Morning, {homeData.user.name}</Text>
    </View>
  )
}