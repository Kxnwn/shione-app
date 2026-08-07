import db from "@/database/database";

export class DatabaseResetService {
    async clearAll() {

        db.execSync(`
            DELETE FROM moods;
            DELETE FROM journals;
            DELETE FROM streaks;
            DELETE FROM verses;
        `);

        console.log("🧹 SQLite database cleared.");

    }
}