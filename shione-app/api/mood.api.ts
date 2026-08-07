

import api from "./api"
import { getToken } from "@/services/storage/auth.storage"


export const saveMood = async (
    mood: string,
    note: string
) => {
    const token = await getToken()

    const response = await api.post("/moods", {
        mood,
        note,
    },
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);

return response.data.result
}

