import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

export const FloatingButton = () => {
    const router = useRouter();

    return (
        <Pressable
            style={({ pressed }) => ({
                position: "absolute",
                bottom: 20,
                right: 20,
                width: 65,
                height: 65,
                borderRadius: 50,
                backgroundColor: pressed ? "#333" : "#000",
                alignItems: "center",
                justifyContent: "center",
                elevation: pressed ? 0 : 5,
                transform: [{ "scale": pressed ? 0.95 : 1 }]
            })}
            onPress={() => router.push("/product/add")}
        >
            <AntDesign name="plus" size={24} color="white" />
        </Pressable>
    );
}