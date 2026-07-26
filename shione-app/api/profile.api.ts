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

export const getStreak = async() => {
    const token = await getToken()

    const response = await api.get("/users/streak", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data.data
}

export const updateProfile = async (name: string, email?: string) => {
    const token = await getToken();

    const body: { name: string; email?: string } = { name };


    if (email && email.trim()) {
        body.email = email.trim();
    }

    const response = await api.put(
        "/auth/update-profile",
        body,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data.data;
};