import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

export const QRFloatingButton = () => {
    const router = useRouter();

    return (
        <Pressable
            style={({ pressed }) => ({
                position: "absolute",
                bottom: 20,
                left: 20,
                width: 65,
                height: 65,
                borderRadius: 50,
                backgroundColor: pressed ? "#E1958E" : "#D4685E",
                alignItems: "center",
                justifyContent: "center",
                elevation: pressed ? 0 : 5,
                transform: [{ "scale": pressed ? 0.95 : 1 }]
            })}
            onPress={() => router.push("/scan")}
        >
            <AntDesign name="qrcode" size={24} color="white" />
        </Pressable>
    );
}