import { MoodRepository, } from "@/repositories/mood.repositories";
import { Mood, NewMood } from "@/types/mood";
import { notifyLocalDataChanged } from "@/services/local-data-events";
import { getToken } from "./storage/auth.storage";
import api from "@/api/api";
import { StreakService } from "@/services/streak.service";
import { saveMood } from "@/api/mood.api";



export class MoodService {

    private streakService = new StreakService();
    private repository = new MoodRepository();

    async saveMood(mood: string, note?: string) {
        const moodCategoryMap: Record<string, string> = {
        Happy: "GRATITUDE",
        Calm: "PEACE",
        Sad: "HOPE",
        Anxious: "PEACE",
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

        await this.streakService.updateStreak();
        await this.streakService.updateStreak();

        notifyLocalDataChanged("mood");

        void this.syncUnsyncedMoods();
        
        console.log("✅SYNCED MOODS TO NEONDATABASE")
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
        let todayMood = await this.repository.getTodayMood();

        console.log("LOCAL SQLite Mood:", todayMood)

        if(!todayMood) {
            console.log("SQLite is Empty. Syncing from server...")
            try {
                await this.syncMoodsFromServer()

                todayMood = await this.repository.getTodayMood()

                console.log("Mood after sync", todayMood)
            } catch (error) {
                console.log("Sync Failed")
                console.warn("Unable to sync moods from server", error)
            }

            
        }

        return todayMood;
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
         const result = await this.repository.markAsSynced(id);

    notifyLocalDataChanged("mood");

    return result;
    }

    async getMoodbyId(id: number) {
        return await this.repository.getMoodbyId(id)
    }

    async getAllMoods(mood: Mood[]) {
        return await this.repository.replaceAllMoods(mood)
    }

    async syncMoodsFromServer() {
        const token = await getToken()

        console.log("Fething moods from backend....")
    
        const response = await api.get("/moods", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        console.log("Backend Response", response.data)
    
        const moodCategoryMap: Record<string, string> = {
    Happy: "GRATITUDE",
    Calm: "PEACE",
    Sad: "HOPE",
    Anxious: "PEACE",
    Angry: "LOVE",
    Excited: "JOY",
};

const moods: Mood[] = response.data.moods.map((m: any) => ({
    id: m.id,
    mood: m.mood,
    category: moodCategoryMap[m.mood],
    note: m.note ?? "",
    created_at: m.createdAt,
    updated_at: m.createdAt,
    isSynced: true,
}));

        console.log("Downloaded", moods.length, "moods")
    
         await this.repository.replaceAllMoods(moods);

        console.log("Saved Moods to sqLite")

        const localMoods = await this.repository.getAllMoods();


        console.log("SqLite now has,",localMoods.length, "moods")
        console.log("Moods")
    }


    async syncUnsyncedMoods() {
    const moods = await this.repository.getUnsyncedMoods();

    for (const mood of moods) {
        try {
            await saveMood(mood.mood, mood.note ?? "");

            await this.repository.markAsSynced(mood.id);

            notifyLocalDataChanged("mood");

            console.log("✅ Mood synced immediately:", mood.id);
        } catch (error) {
            console.log("📴 Mood still offline:", mood.id);
        }
    }
}
    
}