import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNotifications, OrderNotification } from '../../../src/context/notifications.context';
import { router, useRouter } from 'expo-router';
import { orderDetailsConsumer } from "@/src/services/client";
import { checkInternetConnection, NO_INTERNET_MESSAGE } from "@/src/utils/networkUtils";
import { Alert } from "react-native";

export default function NotificationsScreen() {
    const { notifications, markAsRead, refreshNotifications } = useNotifications();
    const router = useRouter();

    const handleAcceptOrder = async (orderId: number) => {
        try {
            const isConnected = await checkInternetConnection();
            if (!isConnected) {
                Alert.alert("Error de conexión", NO_INTERNET_MESSAGE);
                return;
            }

            await orderDetailsConsumer.consume("PATCH", { 
                params: { id: orderId }, 
                data: { status: "accepted" } 
            });
            
            // Refresh notifications after accepting
            refreshNotifications();
            
            Alert.alert("Éxito", "Pedido aceptado correctamente");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo aceptar el pedido");
        }
    };

    const handleNotificationPress = (notification: OrderNotification) => {
        markAsRead(notification.id);
    };

    const renderActionButton = (notification: OrderNotification) => {
        if (notification.status === "pending") {
            return (
                <Pressable
                    style={styles.acceptButton}
                    onPress={() => handleAcceptOrder(notification.id)}
                >
                    <Text style={styles.acceptButtonText}>Aceptar Pedido</Text>
                </Pressable>
            );
        }
        return null;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return '#FFA500'; // Orange
            case 'completed':
                return '#4CAF50'; // Green
            case 'cancelled':
                return '#FF0000'; // Red
            default:
                return '#666666'; // Gray
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'Pendiente';
            case 'completed':
                return 'Completado';
            case 'cancelled':
                return 'Cancelado';
            default:
                return status;
        }
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
                        <View style={styles.headerContainer}>
                            <Text style={styles.title}>Pedido #{item.id}</Text>
                            <View style={[
                                styles.statusBadge, 
                                { backgroundColor: getStatusColor(item.status) }
                            ]}>
                                <Text style={styles.statusText}>
                                    {getStatusText(item.status)}
                                </Text>
                            </View>
                        </View>

                        {item.order_items && item.order_items.map((product, index) => (
                            <View key={index} style={styles.productItem}>
                                <Text style={styles.productName}>
                                    {product.quantity}x {product.name}
                                </Text>
                                <Text style={styles.productPrice}>
                                    {formatCurrency(product.price * product.quantity)}
                                </Text>
                            </View>
                        ))}
                        
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total:</Text>
                            <Text style={styles.totalAmount}>
                                {formatCurrency(item.totalPrice)}
                            </Text>
                        </View>

                        <Text style={styles.time}>
                            {new Date(item.createdAt).toLocaleString()}
                        </Text>

                        {renderActionButton(item)}
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
        backgroundColor: 'white',
    },
    unread: {
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    productName: {
        fontSize: 14,
        color: '#444',
    },
    productPrice: {
        fontSize: 14,
        color: '#666',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    totalAmount: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#D4685E',
    },
    time: {
        marginTop: 8,
        fontSize: 12,
        color: '#999',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    acceptButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});