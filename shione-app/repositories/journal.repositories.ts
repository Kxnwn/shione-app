import db from '@/database/database';
import { Journal, NewJournal } from '@/types/journal';

export class JournalRepository {

    async saveJournal(journal: NewJournal) {
        const result = db.runSync(`
            INSERT INTO journals (
                title,
                content,
                created_at,
                updated_at,
                isSynced,
                isDeleted
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            journal.title,
            journal.content,
            journal.created_at,
            journal.updated_at,
            journal.isSynced ? 1 : 0,
            0
        ]);

        console.log(
            "💾 [SQLite] Journal saved:",
            result
        );

        return result;
    }

    async getJournals(): Promise<Journal[]> {
        const journals = db.getAllSync<Journal>(`
            SELECT *
            FROM journals
            WHERE isDeleted = 0
            ORDER BY created_at DESC
        `);

        return journals.map(j => ({
            ...j,
            isDeleted: Boolean(j.isDeleted),
            isSynced: Boolean(j.isSynced),
            createdAt: j.createdAt || j.created_at
        }));
    }

    async getLatestJournal(): Promise<Journal | null> {
        const latest = db.getFirstSync<Journal>(`
            SELECT *
            FROM journals
            WHERE isDeleted = 0
            ORDER BY created_at DESC
            LIMIT 1
        `);

        if (!latest) return null;

        return {
            ...latest,
            isDeleted: Boolean(latest.isDeleted),
            isSynced: Boolean(latest.isSynced),
            createdAt: latest.createdAt || latest.created_at
        };
    }

    async getAllJournals(): Promise<Journal[]> {
        const journals = db.getAllSync<Journal>(`
            SELECT *
            FROM journals
            WHERE isDeleted = 0
            ORDER BY created_at DESC
        `);

        return journals.map(j => ({
            ...j,
            isDeleted: Boolean(j.isDeleted),
            isSynced: Boolean(j.isSynced),
            createdAt: j.createdAt || j.created_at
        }));
    }

    async getJournalById(id: number): Promise<Journal | null> {
        const journal = db.getFirstSync<Journal>(`
            SELECT *
            FROM journals
            WHERE id = ?
        `, [id]);

        if (!journal) return null;

        return {
            ...journal,
            isDeleted: Boolean(journal.isDeleted),
            isSynced: Boolean(journal.isSynced),
            createdAt: journal.createdAt || journal.created_at
        };
    }

    async updateJournal(journal: Journal) {
        const result = db.runSync(`
            UPDATE journals
            SET
                title = ?,
                content = ?,
                updated_at = ?,
                isSynced = ?
            WHERE id = ?
        `, [
            journal.title,
            journal.content,
            journal.updated_at,
            journal.isSynced ? 1 : 0,
            journal.id
        ]);

        console.log(
            "✏️ [SQLite] Journal updated:",
            result
        );

        return result;
    }

    // Mark a journal as deleted locally.
    // We DON'T immediately remove the row because
    // we may still need its serverId for synchronization.
    async markAsDeleted(id: number) {
        const result = db.runSync(`
            UPDATE journals
            SET isDeleted = 1
            WHERE id = ?
        `, [id]);

        console.log(
            `🗑️ [SQLite] Journal ${id} marked for deletion`
        );

        return result;
    }

    // Get journals that still need to be deleted from the server.
    async getPendingDeletions(): Promise<Journal[]> {
        const journals = db.getAllSync<Journal>(`
            SELECT *
            FROM journals
            WHERE isDeleted = 1
        `);

        return journals.map(j => ({
            ...j,
            isDeleted: true,
            isSynced: Boolean(j.isSynced)
        }));
    }

    // Permanently remove the local row after
    // successful deletion from PostgreSQL.
    async permanentlyDeleteJournal(id: number) {
        const result = db.runSync(`
            DELETE FROM journals
            WHERE id = ?
        `, [id]);

        console.log(
            `🗑️ [SQLite] Journal ${id} permanently removed`
        );

        return result;
    }

    async getUnsyncedJournals(): Promise<Journal[]> {
        const journals = db.getAllSync<Journal>(`
            SELECT *
            FROM journals
            WHERE isSynced = 0
            AND isDeleted = 0
        `);

        return journals.map(j => ({
            ...j,
            isDeleted: Boolean(j.isDeleted),
            isSynced: Boolean(j.isSynced),
            createdAt: j.createdAt || j.created_at
        }));
    }

    async markAsSynced(id: number, serverId?: number) {
        const result = db.runSync(`
            UPDATE journals
            SET
                isSynced = 1,
                serverId = ?
            WHERE id = ?
        `, [
            serverId ?? null,
            id
        ]);

        return result;
    }

    async replaceAllJournals(journals: Journal[]) {

        // IMPORTANT:
        // Only replace NORMAL server journals.
        // Pending local deletions must stay in SQLite
        // until they are successfully deleted from the server.

        const pendingDeletions = await this.getPendingDeletions();

        db.execSync(`
            DELETE FROM journals
            WHERE isDeleted = 0;
        `);

        const statement = db.prepareSync(`
            INSERT INTO journals (
                id,
                serverId,
                title,
                content,
                created_at,
                updated_at,
                isSynced,
                isDeleted
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        try {

            for (const journal of journals) {

                statement.executeSync([
                    journal.id,
                    journal.serverId ?? journal.id,
                    journal.title,
                    journal.content,
                    journal.created_at,
                    journal.updated_at,
                    1,
                    0
                ]);
            }

        } finally {
            statement.finalizeSync();
        }

        console.log(
            "📱 SQLite journals replaced while preserving pending deletions:",
            pendingDeletions.length
        );
    }
}