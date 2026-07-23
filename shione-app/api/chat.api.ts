
import api from "./api";
import { getToken } from "@/services/storage/auth.storage";

export const sendChat = async ( message: string) => {
    const token = await getToken()

    const response = await api.post("/chat",
        {
            message,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data.data
}

export const chatHistory = async () => {
    const token = await getToken()

    const response = await api.get("/chat/history",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data.data
}