import { FloatingButton } from "@/src/components/base/floating.button";
import { ProductItem } from "@/src/components/product/product.item";
import { useSession } from "@/src/context/session.context";
import { useClientFetch } from "@/src/hooks/fetch.hook";
import { commerceDetailsConsumer } from "@/src/services/client";
import { ProductType } from "@/src/types/product.type";
import React from "react";
import { Button, FlatList, RefreshControl, Text } from "react-native";
// import { RefreshControl } from "react-native-gesture-handler";

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

            {/* <View style={{
                margin: 10,
                backgroundColor: '#444444',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                borderRadius: 5,
                padding: 10,
            }}>
                <Text style={{ color: 'white' }}>
                    Bienvenido,
                </Text>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                    {session?.user?.name}
                </Text>
                <Text style={{ color: 'white', fontSize: 12 }}>
                    Aquí encontrarás tus productos, puedes agregar más productos o ver tus notificaciones.
                </Text>

                <FontAwesome6
                    style={{
                        "position": 'absolute',
                        "top": 10,
                        "right": 10,
                    }}
                    name="xmark"
                    size={24}
                    color="white"
                />
            </View> */}
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

            <Button
                title="Cerrar sesion"
                onPress={signOut}
            />
        </>
    );
}