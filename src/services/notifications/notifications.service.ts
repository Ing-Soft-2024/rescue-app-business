import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notifications behavior for both foreground and background
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export class NotificationsService {
    static async initialize() {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync({
                ios: {
                    allowAlert: true,
                    allowBadge: true,
                    allowSound: true,
                    allowAnnouncements: true,
                },
            });
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return false;
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                enableVibrate: true,
                enableLights: true,
                lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                bypassDnd: true,
            });
        }

        return true;
    }

    static async scheduleNotification(title: string, body: string) {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.MAX,
                    data: { data: 'goes here' },
                },
                trigger: null,
            });
        } catch (error) {
            console.error('Error scheduling notification:', error);
        }
    }
} 