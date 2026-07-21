import api from "./api";
import { getToken } from "@/services/storage/auth.storage";

export const createJournal = async (title: string, content: string) => {
    const token = await getToken();
    const response = await api.post("/journals", { title, content }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
};

// Try to get all journals
export const getJournals = async () => {
    const token = await getToken();
    const response = await api.get("/journals", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.journals;
};

// Update existing
export const updateJournal = async (id: number, title: string, content: string) => {
    const token = await getToken();
    const response = await api.put(`/journals/${id}`, { title, content }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
};

// Delete
export const deleteJournal = async (id: number) => {
    const token = await getToken();
    await api.delete(`/journals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};