import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNotifications, OrderNotification } from '../../../src/context/notifications.context';
import { router } from 'expo-router';

export default function NotificationsScreen() {
    const { notifications, markAsRead } = useNotifications();

    const handleNotificationPress = (notification: OrderNotification) => {
        markAsRead(notification.id);
        router.push({
            pathname: '/scan/scannedOrder',
            params: { id: notification.id }
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Pressable
                        style={[
                            styles.notificationItem,
                            !item.isRead && styles.unread
                        ]}
                        onPress={() => handleNotificationPress(item)}
                    >
                        <Text style={styles.title}>Nuevo pedido pendiente</Text>
                        <Text style={styles.details}>
                            Total: ${item.total}
                        </Text>
                        <Text style={styles.time}>
                            {new Date(item.createdAt).toLocaleString()}
                        </Text>
                    </Pressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    notificationItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    unread: {
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    details: {
        marginTop: 4,
        color: '#666',
    },
    time: {
        marginTop: 4,
        fontSize: 12,
        color: '#999',
    },
}); 