import api from "../api/api";
import { MoodRepository } from "../repositories/mood.repositories";
import { JournalRepository } from "../repositories/journal.repositories";
import { getToken } from "./storage/auth.storage";
import { MoodAnalytics } from "../types/analytics";

export interface MoodAnalyticsResult {
    data: MoodAnalytics[];
    isOffline: boolean;
}

export class AnalyticsService {
    private moodRepository = new MoodRepository();
    private journalRepository = new JournalRepository();

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
        const moods = await this.moodRepository.getAllMoods();

        const summary: Record<string, number> = {};
        moods.forEach((mood) => {
            summary[mood.mood] = (summary[mood.mood] || 0) + 1;
        });
        return summary;
    }

    async getMoodAnalytics(): Promise<MoodAnalyticsResult> {
        const token = await getToken();
        const moods = await this.moodRepository.getAllMoods();
        const hasLocalEntries = moods.length > 0;

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

        const summary: Record<string, number> = {};

        moods.forEach((mood) => {
            const key = mood.mood?.trim();
            if (!key) return;
            summary[key] = (summary[key] || 0) + 1;
        });

        const data = Object.entries(summary).map(([mood, count]) => ({
            mood,
            _count: { mood: count },
        }));

        return {
            data,
            isOffline: hasLocalEntries ? true : false,
        };
    }

    async getJournalCount() {
        const journals = await this.journalRepository.getAllJournals();

        return journals.length;
    }

    async getMostFrequentMood() {
        const summary = await this.getMoodSummary();

        let mostFrequent: string | null = null;
        let count = 0;

        Object.entries(summary).forEach(([mood, value]) => {
            if (value > count) {
                count = value;
                mostFrequent = mood;
            }
        });

        return {
            mood: mostFrequent,
            count,
        };
    }

    async getMoodCount() {
        const moods = await this.moodRepository.getAllMoods();
        return moods.length;
    }
}