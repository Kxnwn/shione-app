import { VerseRepository } from '@/repositories/verse.repositories';
import { Verse } from '@/types/verse';
import { getDailyVerse } from "@/api/verse.api";


export class VerseService {

    private repository = new VerseRepository();

    /**
     * Maps mood names to Bible verse categories.
     */
    private moodCategoryMap: Record<string, string> = {
        Happy: 'GRATITUDE',
        Calm: 'PEACE',
        Sad: 'HOPE',
        Anxious: 'PEACE',
        Angry: 'LOVE',
        Excited: 'JOY',
    };

    /**
     * Caches a verse received from the API into the local database.
     */
    async cacheVerseFromApi(verse: Verse): Promise<void> {
        console.log('🌐 [VerseService] Caching verse from API:', { reference: verse.reference, category: verse.category });
        await this.repository.saveVerse(verse);
        // Keep the cache lean
        await this.repository.pruneOldVerses(10);
        console.log('✅ [VerseService] Verse cached from API successfully');
    }

    /**
     * Returns the most recently cached verse (used for offline display).
     */
    async getActiveVerse(): Promise<Verse | null> {
        console.log('📖 [VerseService] Getting active (latest cached) verse...');
        const verse = await this.repository.getLatestVerse();
        console.log('📖 [VerseService] Active verse:', verse ? `"${verse.reference}" (${verse.category})` : 'NONE — no cached verses yet');
        return verse;
    }

    /**
     * Returns a cached verse matching the mood's Bible category.
     * Used after saving a mood to show a relevant verse.
     */
    async getVerseForMood(mood: string): Promise<Verse | null> {
        const category = this.moodCategoryMap[mood];
        console.log(`🎭 [VerseService] Getting verse for mood "${mood}" → category "${category || 'UNKNOWN'}"`);
        if (!category) {
            console.log('⚠️ [VerseService] No category mapping for mood:', mood);
            return null;
        }
        const verse = await this.repository.getVerseByCategory(category);
        console.log('🎭 [VerseService] Mood verse result:', verse ? `"${verse.reference}"` : 'NONE');
        return verse;
    }

    async syncVerseFromServer(): Promise<Verse | null> {
    console.log("🌐 [VerseService] Syncing daily verse...");

    try {
        const verse = await getDailyVerse("PEACE");

        if (!verse) {
            console.log("⚠️ No daily verse received");
            return null;
        }

        console.log(
            "📥 Daily verse downloaded:",
            verse.reference
        );

        await this.cacheVerseFromApi(verse);

        const savedVerse = await this.getActiveVerse();

        console.log(
            "🔥 Daily verse after sync:",
            savedVerse
        );

        return savedVerse;

    } catch (error) {
        console.warn(
            "❌ Daily verse sync failed:",
            error
        );

        return null;
    }
}
}
