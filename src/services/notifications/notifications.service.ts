import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export class NotificationsService {
    static async initialize() {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return false;
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
            });
        }

        return true;
    }

    static async scheduleNotification(title: string, body: string) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
            },
            trigger: null, // null means show immediately
        });
    }
} 