
import api from "../api/api";
import { getToken } from "@/services/storage/auth.storage";

const getAuthHeaders = async () => {
    const token = await getToken();

    if (!token) {
        throw new Error("User is not authenticated.");
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};

export const startUsageSession = async () => {
    const headers = await getAuthHeaders();

    const response = await api.post(
        "/usage/start",
        {},
        { headers }
    );

    return response.data.data;
};

export const heartbeatUsageSession = async (sessionId: number) => {
    const headers = await getAuthHeaders();

    const response = await api.post(
        "/usage/heartbeat",
        { sessionId },
        { headers }
    );

    return response.data.data;
};

export const endUsageSession = async (sessionId: number) => {
    const headers = await getAuthHeaders();

    const response = await api.post(
        "/usage/end",
        { sessionId },
        { headers }
    );

    return response.data.data;
};
