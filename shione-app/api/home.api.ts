import { getToken } from "@/services/storage/auth.storage"
import api from "./api"

export const getHomeData = async () => {
    const token = await getToken()

    const response = await api.get("/home", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    return response.data.data
}

