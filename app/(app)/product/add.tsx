import { productConsumer } from "@/src/services/client";
import { ProductType } from "@/src/types/product.type";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    View,
    TextInput,
    Text,
    Pressable,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { useBusiness } from "@/src/context/business.context";
import StorageController from "@/src/services/storage/controller/storage.controller";

export default function ProductPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { business } = useBusiness();
    const [isLoading, setIsLoading] = React.useState(false);

    // Get image from params
    const image = params.imageUri as string;
    const imageBase64 = params.imageBase64 as string;

    // Basic product state
    const [product, setProduct] = React.useState<ProductType>({
        name: '',
        description: '',
        price: 0,
        image: '',
        businessId: business?.id,
        stock: 0,
        createdAt: new Date()
    });

    // Basic validation
    const validateProduct = () => {
        if (!product.name.trim()) {
            Alert.alert("Error", "El nombre es requerido");
            return false;
        }
        if (!product.description.trim()) {
            Alert.alert("Error", "La descripción es requerida");
            return false;
        }
        if (product.price <= 0) {
            Alert.alert("Error", "El precio debe ser mayor a 0");
            return false;
        }
        if (product.stock < 0) {
            Alert.alert("Error", "El stock no puede ser negativo");
            return false;
        }
        if (!image) {
            Alert.alert("Error", "La imagen es requerida");
            return false;
        }
        return true;
    };

    // Save product
    const handleSave = async () => {
        if (!validateProduct()) return;

        setIsLoading(true);
        try {
            // Upload image
            const uploadedImageUrl = await StorageController.upload(image, imageBase64);
            if (!uploadedImageUrl) {
                Alert.alert("Error", "Error al subir la imagen");
                return;
            }

            // Save product
            const response = await productConsumer.consume('POST', {
                data: { ...product, image: uploadedImageUrl }
            });

            if (response) {
                Alert.alert("Éxito", "Producto guardado", [
                    { text: "OK", onPress: () => router.dismissAll() }
                ]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Error al guardar el producto");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={product.name}
                onChangeText={text => setProduct(prev => ({ ...prev, name: text }))}
            />

            <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={product.description}
                onChangeText={text => setProduct(prev => ({ ...prev, description: text }))}
                multiline
            />

            <TextInput
                style={styles.input}
                placeholder="Precio"
                value={product.price > 0 ? String(product.price) : ''}
                onChangeText={text => {
                    const number = parseFloat(text);
                    setProduct(prev => ({ ...prev, price: isNaN(number) ? 0 : number }));
                }}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                placeholder="Stock"
                value={product.stock > 0 ? String(product.stock) : ''}
                onChangeText={text => {
                    const number = parseInt(text);
                    setProduct(prev => ({ ...prev, stock: isNaN(number) ? 0 : number }));
                }}
                keyboardType="numeric"
            />

            <Pressable
                style={styles.button}
                onPress={handleSave}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.buttonText}>Guardar</Text>
                )}
            </Pressable>

            <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => router.back()}
            >
                <Text style={styles.buttonText}>Cancelar</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: '#F04A41',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});
