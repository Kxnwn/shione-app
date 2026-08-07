import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('shione.db');

export const initializeDatabase = async () => {

    const table = await db.getAllAsync(
    "PRAGMA table_info(streaks)"
        );

    console.log("STREAK TABLE:", table);
    
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
            );
            CREATE TABLE IF NOT EXISTS journals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                isSynced INTEGER DEFAULT 0
            );
        `
    )
     db.execSync(`
        DROP TABLE IF EXISTS streaks;
    `);
    db.execSync(`
    CREATE TABLE IF NOT EXISTS streaks (
    id INTEGER PRIMARY KEY CHECK(id = 1),
    streak INTEGER NOT NULL DEFAULT 0,
    lastUpdated TEXT NOT NULL,
    isSynced INTEGER DEFAULT 0
);
`);
}

export default db;