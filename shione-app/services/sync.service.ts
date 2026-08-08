import NetInfo from "@react-native-community/netinfo";
import { MoodService } from "./mood.service";
import { JournalService } from "./journal.service";
import { VerseService } from "./verse.service";
import { getProfile, getStreak } from "@/api/profile.api";
import { saveMood } from "@/api/mood.api";
import { createJournal } from "@/api/journal.api";
import { getDailyVerse } from "@/api/verse.api";
import { StreakService } from "./streak.service";

export class SyncService {
    private moodService = new MoodService();
    private journalService = new JournalService();
    private verseService = new VerseService();
    private isSyncing = false;

    async startAutoSync() {
    const unsubscribe = NetInfo.addEventListener((state) => {
        if (
            state.isConnected ||
            state.isInternetReachable
        ) {
            void this.syncAll();
        }
    });

    const initialState = await NetInfo.fetch();

    if (
        initialState.isConnected ||
        initialState.isInternetReachable
    ) {
        console.log("🔄 Initial sync starting...");

        await this.syncAll();

        console.log("✅ Initial sync finished");
    }

    return unsubscribe;
}

    async syncAll() {
    if (this.isSyncing) return;

    this.isSyncing = true;

    try {
        // Sync moods
        const unsyncedMoods =
            await this.moodService.getUnsyncedMoods();

        for (const mood of unsyncedMoods) {
            try {
                await saveMood(
                    mood.mood,
                    mood.note ?? ""
                );

                await this.moodService.markAsSynced(mood.id);

            } catch (error) {
                console.warn(
                    "[Sync] Failed to sync mood",
                    mood.id,
                    error
                );
            }
        }

        // Sync journals
        const unsyncedJournals =
            await this.journalService.getUnsyncedJournals();

        for (const journal of unsyncedJournals) {
            try {
                await createJournal(
                    journal.title,
                    journal.content ?? ""
                );

                await this.journalService.markAsSynced(journal.id);

            } catch (error) {
                console.warn(
                    "[Sync] Failed to sync journal",
                    journal.id,
                    error
                );
            }
        }

        // 🔥 RESTORE STREAK
        try {
            await this.streakService.syncStreakFromServer();
        } catch (error) {
            console.warn(
                "[Sync] Failed to restore streak",
                error
            );
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
            const verse = await getDailyVerse("PEACE");
            if (verse) {
                await this.verseService.cacheVerseFromApi(verse);
            }
        } catch (error) {
            console.warn("[Sync] Verse cache sync skipped", error);
        }
    }

    private streakService = new StreakService();
}
