import api from "./api";
import { getToken } from "@/services/storage/auth.storage";

export const getProfile = async () => {
    const token = await getToken()

    const response = await api.get("/users/profile", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data.data
}

export const changePassword = async (currentPassword: string, newPassword: string) => {
    const token = await getToken()

    const response = await api.put("/auth/change-password", {
        currentPassword,
        newPassword
    },
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
)

    return response.data.data
}