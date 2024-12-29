import React from 'react';
import { orderConsumer } from '../services/client';
import { useBusiness } from './business.context';

export type OrderNotification = {
    id: number;
    status: string;
    createdAt: Date;
    total: number;
    isRead: boolean;
}

type NotificationsContextType = {
    notifications: OrderNotification[];
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
    unreadCount: number;
};

const NotificationsContext = React.createContext<NotificationsContextType>({
    notifications: [],
    markAsRead: () => {},
    markAllAsRead: () => {},
    unreadCount: 0,
});

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = React.useState<OrderNotification[]>([]);
    const { business } = useBusiness();

    React.useEffect(() => {
        setNotifications([]);
    }, [business?.id]);

    const checkForNewOrders = React.useCallback(async () => {
        if (!business?.id) return;

        try {
            const orders = await orderConsumer.consume('GET', {
                queryParams: {
                    businessId: business.id
                }
            });

            const pendingOrders = orders
                .filter((order: any) => order.status === 'pending')
                .map((order: any) => ({
                    id: order.id,
                    status: order.status,
                    createdAt: new Date(order.createdAt),
                    total: order.total,
                    isRead: false
                }));

            setNotifications(prev => {
                const newNotifications = pendingOrders.filter(
                    (order: OrderNotification) => !prev.some(n => n.id === order.id)
                );
                return [...prev, ...newNotifications];
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }, [business?.id]);

    React.useEffect(() => {
        const interval = setInterval(checkForNewOrders, 60000); // Check every minute
        checkForNewOrders(); // Initial check
        return () => clearInterval(interval);
    }, [checkForNewOrders]);

    const markAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, isRead: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        );
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <NotificationsContext.Provider value={{
            notifications,
            markAsRead,
            markAllAsRead,
            unreadCount
        }}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => React.useContext(NotificationsContext); 