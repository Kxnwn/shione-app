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
        seconds: 10,
    },
        // trigger: {
        //     type: Notifications.SchedulableTriggerInputTypes.DAILY,
        //     hour: 0,
        //     minute: 0,
        //     seconds: 0
        // },
    });
};

export const initializeNotifications = async () => {
    const granted = await requestNotificationPermission();

    if (!granted) return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    await scheduleDailyMoodReminder();
};