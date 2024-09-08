import { Text, TouchableOpacity, View } from "react-native";

export const ProductActions = () => {

    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "40%",
        }}>
            <TouchableOpacity
                style={{
                    backgroundColor: "green",
                    padding: 5,
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    backgroundColor: "red",
                    padding: 5,
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    );
}