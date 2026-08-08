import db from '@/database/database';
import { CachedVerse, Verse } from '@/types/verse';


export class VerseRepository {

    /**
     * Ensures the verses table exists in the local database.
     */
    ensureTable() {
        console.log('📦 [VerseRepo] Ensuring verses table exists...');
        db.execSync(`
            CREATE TABLE IF NOT EXISTS verses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                verse TEXT NOT NULL,
                reference TEXT NOT NULL,
                category TEXT NOT NULL,
                cached_at TEXT NOT NULL
            );
        `);
        console.log('✅ [VerseRepo] Verses table ready');
    }

    /**
     * Saves a verse to the local cache.
     */
    async saveVerse(verse: Verse): Promise<void> {
        this.ensureTable();
        console.log('💾 [VerseRepo] Saving verse to cache:', { reference: verse.reference, category: verse.category });
        db.runSync(
            `INSERT INTO verses (verse, reference, category, cached_at) VALUES (?, ?, ?, ?)`,
            [verse.verse, verse.reference, verse.category, new Date().toISOString()]
        );
        console.log('✅ [VerseRepo] Verse saved successfully');
    }

    /**
     * Gets the most recently cached verse.
     */
    async getLatestVerse(): Promise<CachedVerse | null> {
        this.ensureTable();
        console.log('🔍 [VerseRepo] Querying latest cached verse...');
        const row = db.getFirstSync<CachedVerse>(
            `SELECT * FROM verses ORDER BY cached_at DESC LIMIT 1`
        );
        console.log('📖 [VerseRepo] Latest verse result:', row ? { id: row.id, reference: row.reference, cached_at: row.cached_at } : 'NONE');
        return row ?? null;
    }

    /**
     * Gets a cached verse matching a specific category.
     */
    async getVerseByCategory(category: string): Promise<CachedVerse | null> {
        this.ensureTable();
        console.log('🔍 [VerseRepo] Querying verse by category:', category);
        const row = db.getFirstSync<CachedVerse>(
            `SELECT * FROM verses WHERE category = ? ORDER BY cached_at DESC LIMIT 1`,
            [category]
        );
        console.log('📖 [VerseRepo] Category verse result:', row ? { id: row.id, reference: row.reference, category: row.category } : 'NONE');
        return row ?? null;
    }

    /**
     * Clears old cached verses, keeping only the most recent N entries.
     */
    async pruneOldVerses(keepCount: number = 10): Promise<void> {
        this.ensureTable();
        console.log('🧹 [VerseRepo] Pruning old verses, keeping latest', keepCount);
        db.runSync(
            `DELETE FROM verses WHERE id NOT IN (
                SELECT id FROM verses ORDER BY cached_at DESC LIMIT ?
            )`,
            [keepCount]
        );
        console.log('✅ [VerseRepo] Prune complete');
    }

    
}
