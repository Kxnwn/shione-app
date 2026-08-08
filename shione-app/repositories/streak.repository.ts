import db from "@/database/database";
import { Streak } from "@/types/streak";

export class StreakRepository {

   async getStreak(): Promise<Streak | null> {

    const result = await db.getFirstAsync<any>(
        `
        SELECT 
            id,
            streak,
            lastUpdated,
            isSynced
        FROM streaks
        WHERE id = 1
        `
    );


    if (!result) return null;


    return {
        id: result.id,
        streak: result.streak,
        lastUpdated: result.lastUpdated,
        isSynced: Boolean(result.isSynced)
    };
}

    async saveStreak(streak: Streak) {
        db.runSync(`
            INSERT OR REPLACE INTO streaks(
                id,
                streak,
                lastUpdated,
                isSynced
            )
            VALUES (?, ?, ?, ?)
        `, [
            streak.id,
            streak.streak,
            streak.lastUpdated,
            streak.isSynced ? 1 : 0
        ]);
        console.log("Saving streak to SQLite:", streak);
    }

    async replaceStreak(streak: Streak) {
    db.runSync(`
        DELETE FROM streaks
    `);

    await this.saveStreak({
        ...streak,
        isSynced: true,
    });
}

}