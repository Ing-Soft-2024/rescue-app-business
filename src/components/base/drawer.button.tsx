import { FontAwesome6 } from "@expo/vector-icons";
import { View } from "react-native";

export const DrawerButton = () => {
    return (
        <View style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 20,
            right: 20,
        }}>
            <FontAwesome6 name="bars" size={24} color="black" />
        </View>
    );
}