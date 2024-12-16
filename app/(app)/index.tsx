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

    const { data, loading, error, reload } = useClientFetch({
        consumer: commerceDetailsConsumer,
        method: 'GET',
        options: { params: { id: 1 } }
    });
    const params = useLocalSearchParams();

    useFocusEffect(React.useCallback(() => {
        if (params.refresh) {
            reload();
        }
    }, [params.refresh]))

    console.log("31,",data);
    console.log("32,",business);
    console.log("33,",error);
    if (error) return <Text>{error}</Text>;
    return (
        <>
            <FlatList
                data={data?.products?.sort((a: ProductType, b: ProductType) => {
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