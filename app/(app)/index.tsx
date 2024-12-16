import { FloatingButton } from "@/src/components/base/floating.button";
import { QRFloatingButton } from "@/src/components/base/qr.floating";
import { ProductItem } from "@/src/components/product/product.item";
import { useBusiness } from "@/src/context/business.context";
import { useSession } from "@/src/context/session.context";
import { useClientFetch } from "@/src/hooks/fetch.hook";
import { commerceDetailsConsumer } from "@/src/services/client";
import { ProductType } from "@/src/types/product.type";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, RefreshControl, Text } from "react-native";

export default function ProductPage() {
    const { signOut } = useSession();

    const { business } = useBusiness();

    const params = React.useMemo(() => ({
        id: 1, // or whatever ID you're using
        refresh: false // Add this property
    }), []); // Empty dependency array if ID never changes

    const { data: commerceDetails, loading, error, reload } = useClientFetch({
        consumer: commerceDetailsConsumer,
        method: 'GET',
        options: {
            params
        }
    });

    useFocusEffect(React.useCallback(() => {
        if (params.refresh) {
            reload();
        }
    }, [params.refresh, reload]));

    console.log("31,",commerceDetails);
    console.log("32,",business);
    
    if (error) return <Text>{error}</Text>;
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
            <QRFloatingButton />

            {/* <Button
                title="Cerrar sesion"
                onPress={signOut}
            /> */}
        </>
    );
}