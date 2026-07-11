import AsyncStorage from "@react-native-async-storage/async-storage"

export const saveToken = async(token: string) => {
    try {
        await AsyncStorage.setItem("token", token)
    } catch (error) {   
        console.log(error);
    }
}

export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem("token")

        return token;
    } catch (error) {
        console.log(error)
    }
}

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem("token")
    } catch (error) {
        console.log(error)
    }
}