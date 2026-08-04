import db from "@/database/database";
import { MoodAnalytics } from "@/types/analytics";

export class AnalyticsRepository {
    async getMoodAnalytics(): Promise<MoodAnalytics[]> {
        const rows = db.getAllSync<{ mood: string; count: number }>(`
            SELECT mood, COUNT(*) as count
            FROM moods
            WHERE mood IS NOT NULL AND trim(mood) != ''
            GROUP BY mood
            ORDER BY count DESC, mood ASC
        `);

        return rows.map((row) => ({
            mood: row.mood,
            _count: { mood: Number(row.count ?? 0) },
        }));
    }

    async getMoodSummary(): Promise<Record<string, number>> {
        const rows = db.getAllSync<{ mood: string; count: number }>(`
            SELECT mood, COUNT(*) as count
            FROM moods
            WHERE mood IS NOT NULL AND trim(mood) != ''
            GROUP BY mood
        `);

        return rows.reduce<Record<string, number>>((summary, row) => {
            if (row.mood) {
                summary[row.mood] = Number(row.count ?? 0);
            }
            return summary;
        }, {});
    }

    async getMoodCount(): Promise<number> {
        const result = db.getFirstSync<{ count: number }>(`SELECT COUNT(*) as count FROM moods`);
        return Number(result?.count ?? 0);
    }

    async getJournalCount(): Promise<number> {
        const result = db.getFirstSync<{ count: number }>(`SELECT COUNT(*) as count FROM journals`);
        return Number(result?.count ?? 0);
    }

    async getMostFrequentMood(): Promise<{ mood: string | null; count: number }> {
        const rows = db.getAllSync<{ mood: string; count: number }>(`
            SELECT mood, COUNT(*) as count
            FROM moods
            WHERE mood IS NOT NULL AND trim(mood) != ''
            GROUP BY mood
            ORDER BY count DESC, mood ASC
            LIMIT 1
        `);

        const top = rows[0];

        return {
            mood: top?.mood ?? null,
            count: Number(top?.count ?? 0),
        };
    }
}
