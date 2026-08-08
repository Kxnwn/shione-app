import api from "./api";
import { getToken } from "@/services/storage/auth.storage";
import { Verse } from "@/types/verse";

export const getDailyVerse = async (
    category: string
): Promise<Verse | null> => {
    try {
        const token = await getToken();

        const response = await api.get(
            `/verse/daily/${category}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data.data;
    } catch (error) {
        console.error(
            "Failed to fetch verse:",
            error
        );
        return null;
    }
};