import { JournalRepository } from "@/repositories/journal.repositories";
import { Journal, NewJournal } from "@/types/journal";
import { notifyLocalDataChanged } from "@/services/local-data-events";

export class JournalService {
    private repository = new JournalRepository();

    async saveJournal(title: string, content: string) {
        const newJournal: NewJournal = {
            title,
            content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            isSynced: false,
        };
        console.log("📝 [JournalService] Saving new journal locally to SQLite...", newJournal);
        const result = await this.repository.saveJournal(newJournal);
        notifyLocalDataChanged("journal");
        console.log("✅ [JournalService] Journal successfully saved in SQLite database!");
        return result;
    }

    async createJournal(title: string, content: string) {
        return await this.saveJournal(title, content);
    }

    async getJournals(): Promise<Journal[]> {
        return await this.repository.getJournals();
    }

    async getLatestJournal(): Promise<Journal | null> {
        return await this.repository.getLatestJournal();
    }

    async updateJournal(id: number, title: string, content: string) {
        const existingJournal = await this.repository.getJournalById(id);
        if (!existingJournal) {
            throw new Error(`Journal with id ${id} not found`);
        }

        const updatedJournal: Journal = {
            ...existingJournal,
            title,
            content,
            updated_at: new Date().toISOString(),
            isSynced: false,
        };

        const result = await this.repository.updateJournal(updatedJournal);
        notifyLocalDataChanged("journal");
        return result;
    }

    async deleteJournal(id: number) {
        const result = await this.repository.deleteJournal(id);
        notifyLocalDataChanged("journal");
        return result;
    }

    async getUnsyncedJournals(): Promise<Journal[]> {
        return await this.repository.getUnsyncedJournals();
    }

    async markAsSynced(id: number) {
        return await this.repository.markAsSynced(id);
    }

    async getJournalById(id: number) {
        return await this.repository.getJournalById(id);
    }
}
