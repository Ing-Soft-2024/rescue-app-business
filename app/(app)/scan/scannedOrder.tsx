import { orderDetailsConsumer } from "@/src/services/client";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View, Image } from "react-native";
import { ProductItem } from "../../../src/components/productItem";
import { checkInternetConnection } from "@/src/utils/networkUtils";
import { NO_INTERNET_MESSAGE } from "@/src/utils/networkUtils";

type OrderItem = {
    id: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        name: string;
        description: string;
        price: string;
        image: string;
    };
};

type Order = {
    id: number;
    status: string;
    createdAt: string;
    total: number;
    order_items: OrderItem[];
};

export default function ScannedOrderPage() {
    const param = useLocalSearchParams();
    const router = useRouter();
    const [order, setOrder] = React.useState<Order | null>(null);

    const confirmOrder = async () => {
        if (!checkInternetConnection()) {
            Alert.alert(NO_INTERNET_MESSAGE);
            return;
        }

        const id = param.id;
        if(!id) return;
        await orderDetailsConsumer.consume("PATCH", { params: { id }, data: { status: "scanned" } })
            .then(() => {
                router.push({
                    "pathname": "/(app)/"
                });
            })
            .catch(console.error);
    }

    useFocusEffect(
        useCallback(() => {
            if(!param.id) return;
            orderDetailsConsumer.consume("GET", { params: { id: param.id } })
                .then((details) => {
                    setOrder(details);
                })
                .catch(console.error);
        }, [param.id])
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderOrderItem = ({ item }: { item: OrderItem }) => (
        <View style={styles.orderItemContainer}>
            {/* <Image 
                source={{ uri: `https://storage.googleapis.com/qresto/${item.product.image}` }} 
                style={styles.productImage}
            /> */}
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.product.name}</Text>
                <Text style={styles.productDescription}>{item.product.description}</Text>
                <View style={styles.priceQuantityContainer}>
                    <Text style={styles.quantity}>Cantidad: {item.quantity}</Text>
                    <Text style={styles.price}>Precio: ${item.price}</Text>
                </View>
                <Text style={styles.subtotal}>Subtotal: ${item.price * item.quantity}</Text>
            </View>
        </View>
    );

    if (!order) {
        return (
            <View style={styles.container}>
                <Text>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>Pedido #{order.id}</Text>
                <Text style={styles.orderDate}>
                    Creado el {formatDate(order.createdAt)}
                </Text>
                <Text style={styles.orderTotal}>Total: ${order.total}</Text>
            </View>

            <FlatList
                data={order.order_items}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.itemsList}
            />

            <View style={styles.buttonContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.confirmButton,
                        { opacity: pressed ? 0.8 : 1 },
                    ]}
                    onPress={confirmOrder}
                >
                    <Text style={styles.confirmText}>Confirmar entrega</Text>
                </Pressable>

                {/* <Pressable
                    style={({ pressed }) => [
                        styles.backButton,
                        { opacity: pressed ? 0.5 : 1 },
                    ]}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backText}>Volver</Text>
                </Pressable> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    orderHeader: {
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    orderTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    orderDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    orderTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D4685E',
        marginTop: 10,
    },
    itemsList: {
        flex: 1,
        padding: 15,
    },
    orderItemContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    productDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    priceQuantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    quantity: {
        fontSize: 14,
        color: '#666',
    },
    price: {
        fontSize: 14,
        color: '#666',
    },
    subtotal: {
        fontSize: 15,
        fontWeight: '600',
        color: '#D4685E',
        marginTop: 5,
    },
    buttonContainer: {
        padding: 20,
        gap: 10,
    },
    confirmButton: {
        backgroundColor: '#D4685E',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        width: '100%',
    },
    confirmText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    backButton: {
        backgroundColor: '#0001',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    backText: {
        textAlign: 'center',
        color: '#0005',
        fontSize: 14,
        fontWeight: '600',
    },
});