import { StreakRepository } from "@/repositories/streak.repository";
import { Streak } from "@/types/streak";
import { getStreak } from "@/api/profile.api"

export class StreakService {

    private repository = new StreakRepository();

     async updateStreak() {

        const today = new Date().toISOString().split("T")[0];

        const streak = await this.repository.getStreak();

        // First mood ever
       if (!streak || streak.streak === 0 || streak.lastUpdated === "1") {

    const newStreak: Streak = {
        id:1,
        streak:1,
        lastUpdated:today,
        isSynced:false
    };


    await this.repository.saveStreak(newStreak);

    console.log("🔥 Created first streak!");

    return;
}

        // Already logged today
        if (streak.lastUpdated === today) {

            console.log("🔥 Already counted today.");

            return;
        }

        // Yesterday
        const yesterday = new Date();

        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayString = yesterday.toISOString().split("T")[0];

        if (streak.lastUpdated === yesterdayString) {

            const updatedStreak: Streak = {

                ...streak,

                streak: streak.streak + 1,
                lastUpdated: today,

                isSynced: false

            };

            await this.repository.saveStreak(updatedStreak);

            console.log("🔥 Streak Increased:", updatedStreak.streak);

            return;
        }

        // Missed one or more days
        const resetStreak: Streak = {

            ...streak,

            streak: 1,


            isSynced: false

        };

        await this.repository.saveStreak(resetStreak);

        console.log("🔥 Streak Reset!");

    }

    async getStreak() {
    return await this.repository.getStreak();
}

    async syncStreakFromServer() {
    const serverStreak = await getStreak();

    console.log(
        "Backend returned streak:",
        serverStreak
    );

    const streak: Streak = {
    id: 1,
    streak: serverStreak.streak,
    lastUpdated: serverStreak.lastActivityDate ?? "",
    isSynced: true
};

    console.log(
        "Saving synced streak:",
        streak
    );

    await this.repository.replaceStreak(streak);

    const savedStreak = await this.repository.getStreak();

    console.log(
        "Saving synced streak:",
        savedStreak
    );

    return savedStreak;
}

}