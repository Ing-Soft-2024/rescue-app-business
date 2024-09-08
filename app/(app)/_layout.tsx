import { useSession } from "@/context/session.context";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
    const { loggedIn } = useSession();

    if (!loggedIn) return <Redirect href={"/signin"} />;

    return (
        <Stack
            screenOptions={{
                headerBackTitleVisible: false,
            }}
        >
            <Stack.Screen name="index" options={{ title: "Mis Productos" }} />
            <Stack.Screen name="product/add" options={{ title: "Agregar Producto" }} />
        </Stack>
    );
}