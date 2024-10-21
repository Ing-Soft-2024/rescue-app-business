import { useSession } from "@/src/context/session.context";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Pressable, Text, View } from "react-native";

export const DrawerContent = (props: any) => {

    const {
        signOut
    } = useSession();
    return (
        <View style={{
            flex: 1,
        }}>
            {/* Content */}
            <DrawerContentScrollView {...props} >
                {/* Logo */}
                <View style={{
                    // backgroundColor: "#121212",
                    padding: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                }}></View>
                <DrawerItemList {...props} />

            </DrawerContentScrollView>

            <View style={{
                paddingBottom: 50,
                paddingHorizontal: 10
            }}>
                {/* Logout button */}
                <Pressable
                    style={{
                        backgroundColor: "#D4685E",
                        padding: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        borderRadius: 5,
                    }}
                    onPress={signOut}
                >
                    <MaterialIcons name="logout" size={24} color="white" />
                    <Text style={{ color: "white", fontSize: 16, marginLeft: 10 }}>Cerrar sesión</Text>
                </Pressable>
            </View>
        </View>
    );
}