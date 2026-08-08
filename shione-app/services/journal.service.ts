import { JournalRepository } from "@/repositories/journal.repositories";
import { Journal, NewJournal } from "@/types/journal";
import { notifyLocalDataChanged } from "@/services/local-data-events";
import { getToken } from "./storage/auth.storage";
import api from "@/api/api";
import { createJournal } from "@/api/journal.api";

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

        void this.syncUnsyncedJournals();
        console.log("✅SYNCED JOURNALS TO NEONDATABASE")
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

    async getAllJournals(): Promise<Journal[]> {
        return await this.repository.getAllJournals();
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

    async syncJournalsFromServer() {
    const token = await getToken();

    console.log("📒 Fetching journals from backend...");

    const response = await api.get("/journals", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    console.log("📒 Backend Response", response.data);

    const journals: Journal[] = response.data.journals.map((j: any) => ({
        id: j.id,
        title: j.title,
        content: j.content,
        created_at: j.createdAt,
        updated_at: j.updatedAt ?? j.createdAt,
        isSynced: true,
    }));

    console.log("📒 Downloaded", journals.length, "journals");

    await this.repository.replaceAllJournals(journals);

    console.log("✅ Saved journals to SQLite");

    const localJournals = await this.repository.getAllJournals();

    console.log("📱 SQLite now has", localJournals.length, "journals");

    return localJournals;
}

    async syncUnsyncedJournals() {
    const journals = await this.repository.getUnsyncedJournals();

    for (const journal of journals) {
        try {
            await createJournal(
                journal.title,
                journal.content ?? ""
            );

            await this.repository.markAsSynced(journal.id);

            notifyLocalDataChanged("journal");

            console.log("✅ Journal synced immediately:", journal.id);
        } catch (error) {
            console.log("📴 Journal still offline:", journal.id);
        }
    }
}
}
