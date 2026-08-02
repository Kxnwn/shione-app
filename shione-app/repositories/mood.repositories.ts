import db from '@/database/database';
import { Mood, NewMood } from '@/types/mood';



export class MoodRepository {
    async saveMood(mood: NewMood) {
        const saveMood = db.runSync(`
            INSERT INTO moods( mood, category, note, created_at, updated_at, isSynced) VALUES(?, ?, ?, ?, ?, ?)
        `,
            [mood.mood, mood.category, mood.note || null, mood.created_at, mood.updated_at, mood.isSynced ? 1 : 0]);
        return saveMood;
    }

    async getTodayMood(): Promise<Mood | null> {
        const todayMood = db.getFirstSync<Mood>(`
            SELECT * FROM moods WHERE DATE(created_at) = DATE('now') ORDER BY created_at DESC LIMIT 1
        `);
        return todayMood ?? null;
    }

    async updateMood(mood: Mood) {
        const updateMood = db.runSync(`
              UPDATE moods SET mood = ?, category = ?, note = ?, updated_at = ?, isSynced = ? WHERE id = ?
            `, [mood.mood, mood.category, mood.note || null, mood.updated_at, mood.isSynced ? 1 : 0, mood.id]);
        return updateMood;
    }

    async deleteMood(id: number) {
        const deleteMood = db.runSync(`
            DELETE FROM moods WHERE id =?`, [id])
    }

    async getUnsyncedMoods(): Promise<Mood[]> {
        const unsycnedMood = db.getAllSync<Mood>(`
            SELECT * FROM moods WHERE isSynced = 0
        `);
        return unsycnedMood;
    }

    async markAsSynced(id: number) {
        const markAsSynced = db.runSync(`
            UPDATE moods SET isSynced = 1 WHERE id = ?
        `, [id]);
        return markAsSynced;
    }

    async getMoodbyId(id: number) {
        const mood = db.getFirstAsync<Mood>(`
            SELECT * FROM moods WHERE id = ?
        `, [id]);
        return mood;
    }
    async getAllMoods(): Promise<Mood[]> {
    const moods = db.getAllSync<Mood>(`
        SELECT * FROM moods
        ORDER BY created_at DESC
    `);
    return moods;
}
}