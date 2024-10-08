import { FloatingButton } from "@/src/components/base/floating.button";
import { ProductItem } from "@/src/components/product/product.item";
import { useSession } from "@/src/context/session.context";
import { useClientFetch } from "@/src/hooks/fetch.hook";
import { commerceDetailsConsumer } from "@/src/services/client";
import { ProductType } from "@/src/types/product.type";
import React from "react";
import { FlatList, RefreshControl, Text } from "react-native";

export default function ProductPage() {
    const { signOut } = useSession();
    const { data, loading, error, reload } = useClientFetch({
        consumer: commerceDetailsConsumer,
        method: 'GET',
        options: { params: { id: 1 } }
    });

    console.log(data);
    if (error) return <Text>{error}</Text>;
    return (
        <>
            <FlatList
                data={data?.products.sort((a: ProductType, b: ProductType) => {
                    return a.createdAt > b.createdAt ? -1 : 1;
                }) ?? []}
                renderItem={({ item }) => (<ProductItem product={item} key={item.id} />)}
                keyExtractor={(item) => item.toString()}
                key="product-list"
                refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
            />
            <FloatingButton />

            {/* <Button
                title="Cerrar sesion"
                onPress={signOut}
            /> */}
        </>
    );
}