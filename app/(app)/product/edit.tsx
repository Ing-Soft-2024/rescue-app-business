import { productDetailsConsumer } from "@/src/services/client";
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
import { BackHandler } from "react-native";

export default function EditProductPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { business } = useBusiness();
    const [isLoading, setIsLoading] = React.useState(false);

    // Add back button handler for Android
    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            router.push("/");
            return true;
        });

        return () => backHandler.remove();
    }, []);

    // Initialize product state from params
    const [product, setProduct] = React.useState<ProductType>({
        id: Number(params.id),
        name: params.name as string,
        description: params.description as string,
        price: Number(params.price),
        image: params.image as string,
        stock: Number(params.stock),
        businessId: business?.id,
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
        return true;
    };

    // Save product
    const handleSave = async () => {
        if (!validateProduct()) return;

        setIsLoading(true);
        try {
            await productDetailsConsumer.consume('POST', {
                params: { id: product.id },
                data: product
            });

            Alert.alert("Éxito", "Producto actualizado", [
                { 
                    text: "OK", 
                    onPress: () => {
                        router.push("/");
                        setTimeout(() => {
                            router.setParams({ refresh: Date.now().toString() });
                        }, 100);
                    }
                }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Error al actualizar el producto");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nombre del producto</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={product.name}
                onChangeText={text => setProduct(prev => ({ ...prev, name: text }))}
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Descripción"
                value={product.description}
                onChangeText={text => setProduct(prev => ({ ...prev, description: text }))}
                multiline
            />

            <Text style={styles.label}>Precio</Text>
            <TextInput
                style={styles.input}
                placeholder="Precio"
                value={String(product.price)}
                onChangeText={text => {
                    const number = parseFloat(text);
                    setProduct(prev => ({ ...prev, price: isNaN(number) ? 0 : number }));
                }}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Stock disponible</Text>
            <TextInput
                style={styles.input}
                placeholder="Stock"
                value={String(product.stock)}
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
                onPress={() => router.push("/")}
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
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
        marginBottom: 8,
        marginTop: 8,
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: 'top',
        paddingTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 15,
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