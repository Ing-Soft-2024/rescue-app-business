import { orderDetailsConsumer } from "@/src/services/client";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ProductItem } from "../../../src/components/productItem";

export default function ScannedOrderPage() {
    const param = useLocalSearchParams();
    const router = useRouter();
    const [items, setItems ] = React.useState<any[]>([]);


    const confirmOrder = async () => {
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
                    const orderItems = details.order_items;
                    console.log(orderItems);
                    setItems(orderItems.map((item:any) => item.product))
                })
                .catch(console.error);
        }, [param.id])
    );
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <FlatList
                data={items}
                renderItem={({ item }) => <ProductItem product={item} />}
                keyExtractor={(item, index) => index.toString()}
                key="product-list"
                style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: '',
                    overflow: 'hidden',
                }}
            />

            <View style={styles.container}>
                <Pressable
                    style={({ pressed }) => [
                        styles.confirmButton,
                        { opacity: pressed ? 0.8 : 1 },
                    ]}
                    onPress={confirmOrder}
                >
                    <Text style={styles.confirmText}>Confirmar pedido</Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.backButton,
                        { opacity: pressed ? 0.5 : 1 },
                    ]}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backText}>Volver</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        flexDirection: 'column',
        gap: 10,
        width: '100%',
        paddingHorizontal: 20,
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
        fontWeight: 'semibold',
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
        fontWeight: 'semibold'
    },
});