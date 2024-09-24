import { productDetailsConsumer } from "@/src/services/client";
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
            <TouchableOpacity
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
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    backgroundColor: "red",
                    padding: 5,
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                }}
                onPress={deleteProduct}
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    );
}