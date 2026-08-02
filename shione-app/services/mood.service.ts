import { MoodRepository, } from "@/repositories/mood.repositories";
import { Mood, NewMood } from "@/types/mood";
import { notifyLocalDataChanged } from "@/services/local-data-events";

export class MoodService {


    private repository = new MoodRepository();

    async saveMood(mood: string, note?: string) {
        const moodCategoryMap: Record<string, string> = {
        Happy: "GRATITUDE",
        Calm: "PEACE",
        Sad: "HOPE",
        Anxiety: "PEACE",
        Angry: "LOVE",
        Excited: "JOY",
    };

    const newMood: NewMood = {
        mood,
        category: moodCategoryMap[mood],
        note, 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isSynced: false,
    };
        const result = await this.repository.saveMood(newMood);
        notifyLocalDataChanged("mood");
        return result;
    }



    async updateMood(id: number,mood: string, note?: string) {
        const moodCategoryMap: Record<string, string> = {
        Happy: "GRATITUDE",
        Calm: "PEACE",
        Sad: "HOPE",
        Anxiety: "PEACE",
        Angry: "LOVE",
        Excited: "JOY",
    };

    const existingMood = await this.repository.getMoodbyId(id);

    if(!existingMood) {
        throw new Error(`Mood with id ${id} not found`);
    }

    const updateMood: Mood = {
        ...existingMood,
        mood,
        category: moodCategoryMap[mood],
        note,
        updated_at: new Date().toISOString(),
        isSynced: false,
    }
     
        const result = await this.repository.updateMood(updateMood);
        notifyLocalDataChanged("mood");
        return result;
    }

    async getTodayMood() {
        return await this.repository.getTodayMood()
    }

    async deleteMood(id: number) {
        const result = await this.repository.deleteMood(id);
        notifyLocalDataChanged("mood");
        return result;
    }

    async getUnsyncedMoods(): Promise<Mood[]> {
        return await this.repository.getUnsyncedMoods()
    }

    async markAsSynced(id: number) {
        return await this.repository.markAsSynced(id)
    }

    async getMoodbyId(id: number) {
        return await this.repository.getMoodbyId(id)
    }
}