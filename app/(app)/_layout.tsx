import { useSession } from "@/context/session.context";
import { MaterialIcons } from "@expo/vector-icons";
import { Redirect, Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function AppLayout() {
    const { session, signOut } = useSession();
    const router = useRouter();

    if (!session) return <Redirect href={"/signin"} />;

    return (
        <Stack
            screenOptions={{
                headerBackTitleVisible: false,
                headerRight: () => (
                    <Pressable
                        style={({ pressed }) => ({
                            padding: 10,
                            opacity: pressed ? 0.5 : 1
                        })}
                        onPress={() => router.push("/notifications")}
                    >
                        <MaterialIcons name="notifications" size={24} color="black" />
                    </Pressable>
                )
            }}
        >
            <Stack.Screen name="index" options={{ title: "Mis Productos" }} />
            <Stack.Screen name="notifications/index" options={{ title: "Notificaciones" }} />
            <Stack.Screen
                name="product/addPhoto"
                options={{
                    "title": "Agregar Producto",
                    "headerShown": false
                }}
            />
            <Stack.Screen name="product/add" options={{ title: "Agregar Producto" }} />
            {/* <Stack.Screen name="product/[id]" options={{ title: "Product Page" }}></Stack.Screen> */}
        </Stack>
    );
}