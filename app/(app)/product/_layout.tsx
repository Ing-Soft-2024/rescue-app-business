import { Stack } from "expo-router";
export default function ProductLayout({ }: {}) {
    return (
        <Stack screenOptions={{
            // headerShown: false,
            headerBackTitleVisible: false,
            headerTintColor: '#D4685E',
        }}>
            <Stack.Screen name="index" options={{ title: "Mis Productos", headerShown: false }} />
            <Stack.Screen name="add" options={{ title: "Agregar Producto" }} />
        </Stack>
    )
}