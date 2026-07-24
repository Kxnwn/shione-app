import api from "./api";
import { getToken } from "@/services/storage/auth.storage";

export const getMoodAnalytics = async () => {
    const token = await getToken()


    const response = await api.get("/analytics/moods",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data.data
}