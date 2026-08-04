import NetInfo from "@react-native-community/netinfo";
import api from "../api/api";
import { AnalyticsRepository } from "../repositories/analytics.repositories";
import { getToken } from "./storage/auth.storage";
import { MoodAnalytics } from "../types/analytics";

export interface MoodAnalyticsResult {
    data: MoodAnalytics[];
    isOffline: boolean;
}

export class AnalyticsService {
    private analyticsRepository = new AnalyticsRepository();

    async getAnalyticsSummary() {
        const [
            moodSummary,
            mostFrequentMood,
            moodCount,
            journalCount,
        ] = await Promise.all([
            this.getMoodSummary(),
            this.getMostFrequentMood(),
            this.getMoodCount(),
            this.getJournalCount(),
        ]);

        return {
            moodSummary,
            mostFrequentMood,
            moodCount,
            journalCount,
        };
    }

    async getMoodSummary() {
        return this.analyticsRepository.getMoodSummary();
    }

    async getMoodAnalytics(): Promise<MoodAnalyticsResult> {
        const token = await getToken();
        const moodCount = await this.analyticsRepository.getMoodCount();
        const hasLocalEntries = moodCount > 0;
        const netState = await NetInfo.fetch();
        const isConnected = Boolean(netState?.isConnected || netState?.isInternetReachable);

        if (!hasLocalEntries) {
            try {
                const response = await api.get("/analytics/moods", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const payload = response?.data?.data;
                if (Array.isArray(payload) && payload.length > 0) {
                    return {
                        data: payload as MoodAnalytics[],
                        isOffline: false,
                    };
                }
            } catch (error) {
                console.warn("Analytics API unavailable, using offline mood data", error);
            }
        }

        const data = await this.analyticsRepository.getMoodAnalytics();

        return {
            data,
            isOffline: !isConnected,
        };
    }

    async getJournalCount() {
        return this.analyticsRepository.getJournalCount();
    }

    async getMostFrequentMood() {
        return this.analyticsRepository.getMostFrequentMood();
    }

    async getMoodCount() {
        return this.analyticsRepository.getMoodCount();
    }
}