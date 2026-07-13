import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "hasSeenOnboarding"

export const saveOnboarding = async () => {
    try {
        await AsyncStorage.setItem(ONBOARDING_KEY, "true")
    } catch (error) {
        console.log(error)
    }
}

export const getOnboarding = async () => {
    try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY)

        return value === "true"
    } catch (error) {
        console.log(error)
        return false
    }
}

export const removeOnboarding = async () => {
    try {
        await AsyncStorage.removeItem(ONBOARDING_KEY)
    } catch (error) {
        console.log(error)
    }
}