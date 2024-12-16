import { useSession } from "@/context/session.context";
import { DrawerContent } from "@/src/components/base/drawer.button";
import { BusinessProvider } from "@/src/context/business.context";
import { MaterialIcons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NotificationsBell } from "@/src/components/base/notifications.bell";



export default function AppLayout() {
    const { session, signOut } = useSession();
    const router = useRouter();

    if (!session) return <Redirect href={"/signin"} />;

        
    return (
        <BusinessProvider>
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
                            <MaterialIcons name="notifications" size={24} color={"#D4685E"} />
                        </Pressable>
                    ),
                    drawerInactiveTintColor: '#E1958E',
                    drawerActiveTintColor: '#D4685E',
                    drawerType: "front",
                }}
                drawerContent={(props) => <DrawerContent {...props} />}
            >
                <Drawer.Screen
                    name="index"
                    options={{
                        title: "Mis Productos",
                        drawerIcon: (props) => <MaterialIcons name="home" {...props} />,
                        headerRight: () => <NotificationsBell />
                    }} />
                <Drawer.Screen
                    name="notifications/index"
                    options={{
                        title: "Notificaciones",
                        drawerIcon: (props) => <MaterialIcons name="notifications" {...props} />
                    }} />
                <Drawer.Screen
                    name="scan/index"
                    options={{
                        title: "Escanear",
                        "headerShown": false,
                        drawerIcon: (props) => <MaterialIcons name="qr-code-scanner" {...props} />,
                    }} />

                <Drawer.Screen
                    name="scan/scannedOrder"
                    options={{
                        title: "Escanear",
                        drawerIcon: (props) => <MaterialIcons name="qr-code-scanner" {...props} />,
                        "swipeEnabled": false,
                        "headerLeft": () => null,
                        "headerRight": () => null,
                    }} />
                <Drawer.Screen
                    name="product"
                    options={{
                        "title": "Agregar Producto",
                        "headerShown": false,
                        "drawerIcon": (props) => <MaterialIcons name="add" {...props} />,
                        "swipeEnabled": false,
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
        </BusinessProvider>
    );
}