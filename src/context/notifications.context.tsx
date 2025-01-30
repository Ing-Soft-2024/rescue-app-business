import React from 'react';
import * as SecureStore from 'expo-secure-store';
import { orderConsumer } from '../services/client';
import { useBusiness } from './business.context';

export type OrderNotification = {
    id: number;
    status: string;
    createdAt: string;
    totalPrice: number;
    isRead: boolean;
    business: {
        name: string;
    };
    order_items: {
        id: number;
        name: string;
        price: number;
        quantity: number;
    }[];
}

export type NotificationsContextType = {
    notifications: OrderNotification[];
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
    unreadCount: number;
    refreshNotifications: () => Promise<void>;
};

const NotificationsContext = React.createContext<NotificationsContextType>({
    notifications: [],
    markAsRead: () => {},
    markAllAsRead: () => {},
    unreadCount: 0,
    refreshNotifications: async () => {},
});

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = React.useState<OrderNotification[]>([]);
    const { business } = useBusiness();

    const loadReadStatus = async () => {
        if (!business?.id) return;
        
        try {
            const savedStatus = await SecureStore.getItemAsync(
                `notifications_read_status_${business.id}`
            );
            if (savedStatus) {
                const readStatus = JSON.parse(savedStatus) as Record<number, boolean>;
                setNotifications(prev => 
                    prev.map(notification => ({
                        ...notification,
                        isRead: readStatus[notification.id] || false
                    }))
                );
            }
        } catch (error) {
            console.error('Error loading read status:', error);
        }
    };

    const saveReadStatus = async () => {
        if (!business?.id) return;

        try {
            const readStatus = notifications.reduce((acc, notification) => {
                acc[notification.id] = notification.isRead;
                return acc;
            }, {} as Record<number, boolean>);

            await SecureStore.setItemAsync(
                `notifications_read_status_${business.id}`,
                JSON.stringify(readStatus)
            );
        } catch (error) {
            console.error('Error saving read status:', error);
        }
    };

    const checkForNewOrders = React.useCallback(async () => {
        if (!business?.id) return;

        try {
            const orders = await orderConsumer.consume('GET', {
                queryParams: {
                    businessId: business.id
                }
            });
            
            // Load saved read status and previous order statuses
            const savedStatus = await SecureStore.getItemAsync(
                `notifications_read_status_${business.id}`
            );
            const savedPrevStatus = await SecureStore.getItemAsync(
                `notifications_prev_status_${business.id}`
            );
            
            const readStatus = savedStatus ? JSON.parse(savedStatus) : {};
            const prevOrderStatuses = savedPrevStatus ? JSON.parse(savedPrevStatus) : {};

            const pendingOrders = orders
                .filter((order: any) => [
                    'pending',
                    'accepted',
                    'completed_cash',
                    'completed_mercadopago',
                    'scanned',
                    'cancelled'
                ].includes(order.status))
                .map((order: any) => {
                    const previousStatus = prevOrderStatuses[order.id];
                    const statusChanged = previousStatus && previousStatus !== order.status;
                    
                    // Mark as unread only if status changed to one of these states
                    const shouldBeUnread = statusChanged && [
                        'cancelled',
                        'completed_cash',
                        'completed_mercadopago'
                    ].includes(order.status);

                    // Update previous status for this order
                    prevOrderStatuses[order.id] = order.status;

                    return {
                        id: order.id,
                        status: order.status,
                        createdAt: order.createdAt,
                        totalPrice: order.totalPrice,
                        business: order.business,
                        order_items: order.order_items || [],
                        isRead: shouldBeUnread ? false : (readStatus[order.id] || false)
                    };
                });

            // Save updated previous statuses
            await SecureStore.setItemAsync(
                `notifications_prev_status_${business.id}`,
                JSON.stringify(prevOrderStatuses)
            );

            setNotifications(pendingOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }, [business?.id]);

    // Load read status when business changes
    React.useEffect(() => {
        if (business?.id) {
            checkForNewOrders();
        } else {
            setNotifications([]);
        }
    }, [business?.id, checkForNewOrders]);

    // Save read status whenever notifications change
    React.useEffect(() => {
        if (notifications.length > 0) {
            saveReadStatus();
        }
    }, [notifications, business?.id]);

    const markAsRead = async (id: number) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, isRead: true } : notif
            )
        );
        // Save immediately after marking as read
        await saveReadStatus();
    };

    const markAllAsRead = async () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        );
        // Save immediately after marking all as read
        await saveReadStatus();
    };

    // Set up polling interval for new orders
    React.useEffect(() => {
        const interval = setInterval(checkForNewOrders, 15000); // Check every minute
        return () => clearInterval(interval);
    }, [checkForNewOrders]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <NotificationsContext.Provider value={{
            notifications,
            markAsRead,
            markAllAsRead,
            unreadCount,
            refreshNotifications: checkForNewOrders
        }}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => React.useContext(NotificationsContext); 