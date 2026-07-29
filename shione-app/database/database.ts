import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('shione.db');

export const initializeDatabase = () => {
    db.execSync(
        `
            CREATE TABLE IF NOT EXISTS moods (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                mood TEXT NOT NULL,
                category TEXT NOT NULL,
                note TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                isSynced INTEGER DEFAULT 0
            )
        `
    )
}

export default db;