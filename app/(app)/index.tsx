import { FloatingButton } from "@/src/components/base/floating.button";
import { QRFloatingButton } from "@/src/components/base/qr.floating";
import { ProductItem } from "@/src/components/product/product.item";
import { useBusiness } from "@/src/context/business.context";
import { useSession } from "@/src/context/session.context";
import { useClientFetch } from "@/src/hooks/fetch.hook";
import { commerceDetailsConsumer, productConsumer } from "@/src/services/client";
import { ProductType } from "@/src/types/product.type";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React from "react";
import { Button, FlatList, RefreshControl, Text } from "react-native";

export default function ProductPage() {
    const { signOut } = useSession();
    const { business } = useBusiness();

    const params = React.useMemo(() => ({
        id: business?.id,
        refresh: false
    }), [business?.id]);

    const { data: commerceDetails, loading, error, reload } = useClientFetch({
        consumer: commerceDetailsConsumer,
        method: 'GET',
        options: {
            params,
            enabled: !!business?.id
        }
    });

    useFocusEffect(React.useCallback(() => {
        if (params.refresh && business?.id) {
            reload();
        }
    }, [params.refresh, reload, business?.id]));

    if (!business?.id) return <Text>Loading business...</Text>;
    if (error) return <Text>{error}</Text>;

    async function tempAddProduct(): Promise<void> {
        const response = await productConsumer.consume('POST', {
            data: {
                name: "Test",
                description: "Test",
                price: 100,
                stock: 3,
                businessId: business?.id
            }
        });
    }

    
    return (
        <>
            <FlatList
                data={commerceDetails?.products?.sort((a: ProductType, b: ProductType) => {
                    return a.createdAt > b.createdAt ? -1 : 1;
                }) ?? []}
                renderItem={({ item }) => (<ProductItem product={item} key={item.id} />)}
                keyExtractor={(item, index) => index.toString()}
                key="product-list"
                refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
            />
            <FloatingButton />
            <Button title="Add Product" onPress={tempAddProduct} />

            <QRFloatingButton />
        </>
    );
}