import { productDetailsConsumer } from "@/src/services/client";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export const ProductActions = ({ id }: { id: number }) => {

    const router = useRouter();
    const deleteProduct = () => productDetailsConsumer.consume('DELETE', { params: { id } })
    const editProduct = () => router.push('/product/add');

    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "40%",
        }}>
            {/* <TouchableOpacity
                style={{
                    backgroundColor: "green",
                    padding: 5,
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                }}
                onPress={editProduct}
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>Editar</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
                style={{
                    backgroundColor: "#E15144",
                    padding: 5,
                    flex: 1,
                    gap: 5,
                    alignItems: "center",
                    justifyContent: "center"
                }}
                onPress={deleteProduct}
            >
                <FontAwesome6 name="trash" size={16} color="white" />
                <Text style={{ color: "white", fontWeight: "bold" }}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    );
}