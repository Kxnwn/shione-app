import { JournalRepository } from "@/repositories/journal.repositories";
import { Journal, NewJournal } from "@/types/journal";
import { notifyLocalDataChanged } from "@/services/local-data-events";
import { getToken } from "./storage/auth.storage";
import api from "@/api/api";
import {
    createJournal,
    deleteJournal as deleteJournalApi
} from "@/api/journal.api";

export class JournalService {

    private repository = new JournalRepository();

    async saveJournal(
        title: string,
        content: string
    ) {

        const newJournal: NewJournal = {
            title,
            content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            isSynced: false,
        };

        console.log(
            "📝 Saving journal locally..."
        );

        const result =
            await this.repository.saveJournal(newJournal);

        notifyLocalDataChanged("journal");

        // Try to sync immediately.
        // If offline, SyncService will handle it later.
        void this.syncUnsyncedJournals();

        return result;
    }

    async createJournal(
        title: string,
        content: string
    ) {
        return await this.saveJournal(
            title,
            content
        );
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

    async updateJournal(
        id: number,
        title: string,
        content: string
    ) {

        const existingJournal =
            await this.repository.getJournalById(id);

        if (!existingJournal) {
            throw new Error(
                `Journal with id ${id} not found`
            );
        }

        const updatedJournal: Journal = {
            ...existingJournal,
            title,
            content,
            updated_at: new Date().toISOString(),
            isSynced: false,
            isDeleted: false,
        };

        const result =
            await this.repository.updateJournal(
                updatedJournal
            );

        notifyLocalDataChanged("journal");

        return result;
    }

    async deleteJournal(id: number) {

        const journal =
            await this.repository.getJournalById(id);

        if (!journal) {
            throw new Error(
                `Journal with id ${id} not found`
            );
        }

        // If this journal has never been synced,
        // there is nothing to delete from PostgreSQL.
        //
        // We can simply remove it locally.
        if (!journal.serverId) {

            console.log(
                "🗑️ Deleting unsynced local journal..."
            );

            await this.repository.permanentlyDeleteJournal(
                id
            );

            notifyLocalDataChanged("journal");

            return;
        }

        // If it already exists on the server,
        // mark it as deleted locally.
        //
        // DO NOT permanently remove it yet.
        // We still need serverId for synchronization.
        await this.repository.markAsDeleted(id);

        notifyLocalDataChanged("journal");

        console.log(
            `🗑️ Journal ${id} marked for server deletion`
        );
    }

    async getUnsyncedJournals(): Promise<Journal[]> {
        return await this.repository.getUnsyncedJournals();
    }

    async getPendingDeletions(): Promise<Journal[]> {
        return await this.repository.getPendingDeletions();
    }

    async markAsSynced(
        id: number,
        serverId?: number
    ) {
        return await this.repository.markAsSynced(
            id,
            serverId
        );
    }

    async permanentlyDeleteJournal(id: number) {
        return await this.repository.permanentlyDeleteJournal(
            id
        );
    }

    async getJournalById(id: number) {
        return await this.repository.getJournalById(id);
    }

    async syncJournalsFromServer() {

        const token = await getToken();

        console.log(
            "📒 Fetching journals from backend..."
        );

        const response = await api.get(
            "/journals",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const serverJournals =
            response.data.journals;

        const journals: Journal[] =
            serverJournals.map((j: any) => ({
                id: j.id,
                serverId: j.id,
                title: j.title,
                content: j.content,
                created_at: j.createdAt,
                updated_at:
                    j.updatedAt ?? j.createdAt,
                isSynced: true,
                isDeleted: false,
            }));

        console.log(
            "📒 Downloaded",
            journals.length,
            "journals"
        );

        await this.repository.replaceAllJournals(
            journals
        );

        const localJournals =
            await this.repository.getAllJournals();

        console.log(
            "📱 SQLite now has",
            localJournals.length,
            "journals"
        );

        return localJournals;
    }

    async syncUnsyncedJournals() {

        const journals =
            await this.repository.getUnsyncedJournals();

        for (const journal of journals) {

            try {

                const serverJournal =
                    await createJournal(
                        journal.title,
                        journal.content ?? ""
                    );

                // IMPORTANT:
                // Save the PostgreSQL ID into SQLite.
                await this.repository.markAsSynced(
                    journal.id,
                    serverJournal.id
                );

                notifyLocalDataChanged(
                    "journal"
                );

                console.log(
                    "✅ Journal synced:",
                    journal.id,
                    "→ server:",
                    serverJournal.id
                );

            } catch (error) {

                console.log(
                    "📴 Journal still offline:",
                    journal.id
                );
            }
        }
    }
}