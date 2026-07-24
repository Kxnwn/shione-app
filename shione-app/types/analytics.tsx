import { Mood } from "./mood";

export interface MoodAnalytics {
    mood: Mood;

    _count: {
        mood: number;
    };
}