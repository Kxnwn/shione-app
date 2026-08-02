import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
};

export const scheduleDailyMoodReminder = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🌸 Shione",
            body: "Don't forget to log your mood today 💜",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 60 * 60 * 24,
        },
    });
};

export const scheduleStreakReminder = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🔥 Keep your streak going",
            body: "A quick mood check-in will help you keep your Shione streak alive.",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 60 * 60 * 12,
        },
    });
};

export const scheduleJournalReminder = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "📝 Journal reminder",
            body: "Your thoughts matter — add a quick journal entry before the day ends.",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 60 * 60 * 24,
        },
    });
};

export const initializeNotifications = async () => {
    const granted = await requestNotificationPermission();

    if (!granted) return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    await scheduleDailyMoodReminder();
    await scheduleStreakReminder();
    await scheduleJournalReminder();
};