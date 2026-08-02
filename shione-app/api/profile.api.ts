import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { MoodRepository } from "@/repositories/mood.repositories";
import { JournalRepository } from "@/repositories/journal.repositories";
import { getToken } from "@/services/storage/auth.storage";

const PROFILE_CACHE_KEY = "profile-cache";

const getCachedProfile = async () => {
    try {
        const cached = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        console.warn("Failed to read cached profile", error);
        return null;
    }
};

const saveCachedProfile = async (profileData: any) => {
    try {
        await AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profileData));
    } catch (error) {
        console.warn("Failed to cache profile", error);
    }
};

const normalizeProfilePayload = async (payload: any) => {
    const moodRepository = new MoodRepository();
    const journalRepository = new JournalRepository();
    const [moods, journals] = await Promise.all([
        moodRepository.getAllMoods(),
        journalRepository.getAllJournals(),
    ]);

    const profileSource = payload?.getProfile ?? payload?.profile ?? payload?.user ?? payload;
    const profile = profileSource?.id || profileSource?.name || profileSource?.email || profileSource?.createdAt
        ? {
            id: profileSource?.id ?? 0,
            email: profileSource?.email ?? "",
            name: profileSource?.name ?? "Offline User",
            createdAt: profileSource?.createdAt ?? profileSource?.created_at ?? new Date().toISOString(),
        }
        : {
            id: 0,
            email: "",
            name: "Offline User",
            createdAt: new Date().toISOString(),
        };

    const remoteMoodCount = Number(payload?.getMoodCount ?? payload?.moodCount ?? 0);
    const remoteJournalCount = Number(payload?.getJournalCount ?? payload?.journalCount ?? 0);
    const localMoodCount = moods.length;
    const localJournalCount = journals.length;
    const hasLocalEntries = localMoodCount > 0 || localJournalCount > 0;

    return {
        getProfile: profile,
        getMoodCount: hasLocalEntries ? localMoodCount : remoteMoodCount,
        getJournalCount: hasLocalEntries ? localJournalCount : remoteJournalCount,
        getChatCount: payload?.getChatCount ?? 0,
    };
};

const buildOfflineProfilePayload = async (override?: any) => {
    const moodRepository = new MoodRepository();
    const journalRepository = new JournalRepository();
    const cachedProfile = await getCachedProfile();

    const [moods, journals] = await Promise.all([
        moodRepository.getAllMoods(),
        journalRepository.getAllJournals(),
    ]);

    const baseProfile = override?.getProfile ?? cachedProfile?.getProfile ?? {
        id: 0,
        name: "Offline User",
        email: "",
        createdAt: new Date().toISOString(),
    };

    const offlineProfile = {
        getProfile: {
            id: baseProfile.id ?? 0,
            name: baseProfile.name ?? "Offline User",
            email: baseProfile.email ?? "",
            createdAt: baseProfile.createdAt ?? new Date().toISOString(),
        },
        getMoodCount: override?.getMoodCount ?? moods.length,
        getJournalCount: override?.getJournalCount ?? journals.length,
        getChatCount: override?.getChatCount ?? cachedProfile?.getChatCount ?? 0,
    };

    return offlineProfile;
};

const calculateOfflineStreak = (moods: Array<{ created_at?: string }>) => {
    const dates = Array.from(
        new Set(
            moods
                .map((mood) => mood.created_at?.split("T")[0])
                .filter((value): value is string => Boolean(value))
        )
    ).sort();

    if (dates.length === 0) return 0;

    let streak = 0;
    const today = new Date();

    for (let index = 0; index < dates.length; index += 1) {
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - index);
        const expectedKey = expectedDate.toISOString().slice(0, 10);

        if (dates[dates.length - 1 - index] === expectedKey) {
            streak += 1;
        } else {
            break;
        }
    }

    return streak;
};

export const getProfile = async () => {
    const token = await getToken();

    try {
        const response = await api.get("/users/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const normalized = await normalizeProfilePayload(response?.data?.data);
        await saveCachedProfile(normalized);
        return normalized;
    } catch (error) {
        const offlineProfile = await buildOfflineProfilePayload();
        return offlineProfile;
    }
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
    const token = await getToken();

    const response = await api.put(
        "/auth/change-password",
        {
            currentPassword,
            newPassword,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data.data;
};

export const getStreak = async () => {
    const token = await getToken();

    try {
        const response = await api.get("/users/streak", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.data;
    } catch (error) {
        const moodRepository = new MoodRepository();
        const moods = await moodRepository.getAllMoods();
        const offlineStreak = calculateOfflineStreak(moods);
        return { streak: offlineStreak };
    }
};

export const updateProfile = async (name: string, email?: string) => {
    const token = await getToken();

    const body: { name: string; email?: string } = { name };

    if (email && email.trim()) {
        body.email = email.trim();
    }

    try {
        const response = await api.put("/auth/update-profile", body, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const normalized = await normalizeProfilePayload(response?.data?.data);
        await saveCachedProfile(normalized);
        return normalized;
    } catch (error) {
        const cachedProfile = await getCachedProfile();
        const offlineProfile = await buildOfflineProfilePayload({
            getProfile: {
                id: cachedProfile?.getProfile?.id ?? 0,
                name,
                email: body.email ?? cachedProfile?.getProfile?.email ?? "",
                createdAt: cachedProfile?.getProfile?.createdAt ?? new Date().toISOString(),
            },
            getMoodCount: cachedProfile?.getMoodCount ?? 0,
            getJournalCount: cachedProfile?.getJournalCount ?? 0,
            getChatCount: cachedProfile?.getChatCount ?? 0,
        });

        await saveCachedProfile(offlineProfile);
        return offlineProfile;
    }
};