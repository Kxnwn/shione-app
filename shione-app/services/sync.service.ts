import NetInfo from "@react-native-community/netinfo";
import { MoodService } from "./mood.service";
import { JournalService } from "./journal.service";
import { VerseService } from "./verse.service";
import { getProfile, getStreak, updateProfile } from "@/api/profile.api";
import { saveMood } from "@/api/mood.api";
import { createJournal } from "@/api/journal.api";
import { getRandomVerse } from "@/api/verse.api";

export class SyncService {
    private moodService = new MoodService();
    private journalService = new JournalService();
    private verseService = new VerseService();
    private isSyncing = false;

    async startAutoSync() {
        const unsubscribe = NetInfo.addEventListener((state) => {
            if (state.isConnected) {
                void this.syncAll();
            }
        });

        return unsubscribe;
    }

    async syncAll() {
        if (this.isSyncing) return;

        this.isSyncing = true;

        try {
            const unsyncedMoods = await this.moodService.getUnsyncedMoods();
            for (const mood of unsyncedMoods) {
                await saveMood(mood.mood, mood.note ?? "");
                await this.moodService.markAsSynced(mood.id);
            }

            const unsyncedJournals = await this.journalService.getUnsyncedJournals();
            for (const journal of unsyncedJournals) {
                await createJournal(journal.title, journal.content ?? "");
                await this.journalService.markAsSynced(journal.id);
            }

            await this.syncProfile();
            await this.syncVerseCache();
        } catch (error) {
            console.warn("[Sync] Sync failed", error);
        } finally {
            this.isSyncing = false;
        }
    }

    private async syncProfile() {
        try {
            await getProfile();
            await getStreak();
        } catch (error) {
            console.warn("[Sync] Profile sync skipped", error);
        }
    }

    private async syncVerseCache() {
        try {
            const verse = await getRandomVerse("PEACE");
            if (verse) {
                await this.verseService.cacheVerseFromApi(verse);
            }
        } catch (error) {
            console.warn("[Sync] Verse cache sync skipped", error);
        }
    }
}
