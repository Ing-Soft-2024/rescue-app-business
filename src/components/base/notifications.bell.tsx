import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNotifications } from '../../context/notifications.context';

export const NotificationsBell = () => {
    const { unreadCount } = useNotifications();

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                { opacity: pressed ? 0.7 : 1 }
            ]}
            onPress={() => router.push('/notifications')}
        >
            <Ionicons name="notifications-outline" size={24} color="black" />
            {unreadCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        right: 4,
        top: 4,
        backgroundColor: '#D4685E',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
}); 