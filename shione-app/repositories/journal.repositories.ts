import db from '@/database/database';
import { Journal, NewJournal } from '@/types/journal';

export class JournalRepository {
    async saveJournal(journal: NewJournal) {
        const saveJournal = db.runSync(`
            INSERT INTO journals (title, content, created_at, updated_at, isSynced) VALUES (?, ?, ?, ?, ?)
        `, [journal.title, journal.content, journal.created_at, journal.updated_at, journal.isSynced ? 1 : 0]);
        console.log("💾 [SQLite JournalRepository] Journal saved in SQLite database successfully! Result:", saveJournal, "Journal:", journal);
        return saveJournal;
    }

    async getJournals(): Promise<Journal[]> {
        const journals = db.getAllSync<Journal>(`
            SELECT * FROM journals ORDER BY created_at DESC
        `);
        console.log("📖 [SQLite JournalRepository] Fetched journals from SQLite:", journals);
        return journals.map(j => ({ ...j, createdAt: j.createdAt || j.created_at }));
    }

    async getLatestJournal(): Promise<Journal | null> {
        const latest = db.getFirstSync<Journal>(`
            SELECT * FROM journals ORDER BY created_at DESC LIMIT 1
        `);
        console.log("🌟 [SQLite JournalRepository] Latest journal from SQLite:", latest);
        if (!latest) return null;
        return { ...latest, createdAt: latest.createdAt || latest.created_at };
    }

    async updateJournal(journal: Journal) {
        const updateJournal = db.runSync(`
            UPDATE journals SET title = ?, content = ?, updated_at = ?, isSynced = ? WHERE id = ?
        `, [journal.title, journal.content, journal.updated_at, journal.isSynced ? 1 : 0, journal.id]);
        console.log("✏️ [SQLite JournalRepository] Journal updated in SQLite database successfully! Result:", updateJournal);
        return updateJournal;
    }

    async deleteJournal(id: number) {
        const deleteJournal = db.runSync(`
            DELETE FROM journals WHERE id = ?
        `, [id]);
        console.log(`🗑️ [SQLite JournalRepository] Journal id ${id} deleted from SQLite database successfully! Result:`, deleteJournal);
        return deleteJournal;
    }

    async getUnsyncedJournals(): Promise<Journal[]> {
        const unsyncedJournals = db.getAllSync<Journal>(`
            SELECT * FROM journals WHERE isSynced = 0
        `);
        return unsyncedJournals.map(j => ({ ...j, createdAt: j.createdAt || j.created_at }));
    }

    async markAsSynced(id: number) {
        const markAsSynced = db.runSync(`
            UPDATE journals SET isSynced = 1 WHERE id = ?
        `, [id]);
        return markAsSynced;
    }

    async getJournalById(id: number): Promise<Journal | null> {
        const journal = db.getFirstSync<Journal>(`
            SELECT * FROM journals WHERE id = ?
        `, [id]);
        if (!journal) return null;
        return { ...journal, createdAt: journal.createdAt || journal.created_at };
    }
}
