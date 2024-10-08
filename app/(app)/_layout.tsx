import { useSession } from "@/context/session.context";
import { MaterialIcons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";



export default function AppLayout() {
    const { session, signOut } = useSession();
    const router = useRouter();

    if (!session) return <Redirect href={"/signin"} />;

    return (
        <GestureHandlerRootView style={{
            flex: 1,
            backgroundColor: '#121212',
        }}>
            <Drawer
                screenOptions={{
                    // headerBackTitleVisible: false,
                    headerTintColor: '#D4685E',
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
                    ),
                    drawerInactiveTintColor: '#E1958E',
                    drawerActiveTintColor: '#D4685E',
                }}
            >
                <Drawer.Screen name="index" options={{ title: "Mis Productos" }} />
                <Drawer.Screen name="notifications/index" options={{ title: "Notificaciones" }} />
                <Drawer.Screen
                    name="product"
                    options={{
                        "title": "Agregar Producto",
                        "headerShown": false,
                    }}
                />
                {/* <Drawer.Screen name="product/add" options={{ title: "Agregar Producto" }} /> */}
                {/* <Stack.Screen name="product/[id]" options={{ title: "Product Page" }}></Stack.Screen> */}
            </Drawer>
        </GestureHandlerRootView>
    );
}