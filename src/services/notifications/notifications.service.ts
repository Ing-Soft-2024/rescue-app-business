import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

// Register background task
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
    if (error) {
        console.error('Background task error:', error);
        return;
    }
    // Handle the notification data
    if (data) {
        const { title, body } = data.notification?.request?.content || {};
        if (title && body) {
            Notifications.scheduleNotificationAsync({
                content: { title, body, sound: 'default' },
                trigger: null,
            });
        }
    }
});

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

        // Configure notification handling
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });

        // Register for background notifications
        await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

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
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    sound: 'default',
                },
                trigger: null,
            });
        } catch (error) {
            console.error('Error scheduling notification:', error);
        }
    }
} 