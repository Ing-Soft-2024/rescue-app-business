import { useSession } from "@/src/context/session.context";
import { AntDesign } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

export const GoogleComponent = () => {
    const { signInWith } = useSession();
    return (
        <Pressable
            style={({ pressed }) => ({
                display: 'flex',
                padding: 10,
                backgroundColor: pressed ? '#F04A41' : '#F04A41',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 5,
                borderRadius: 5,
            })}

            onPress={() => signInWith("Google")}
        >
            <AntDesign name="google" size={18} color="white" />
            <Text style={{ fontSize: 16, color: "white" }}>Iniciar sesión con Google</Text>
        </Pressable>
    )
}