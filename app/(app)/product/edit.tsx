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
    const [isInitialLoading, setIsInitialLoading] = React.useState(true);

    // Add back button handler for Android
    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigateToHome();
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

    React.useEffect(() => {
        // Simulate data loading/initialization
        setTimeout(() => {
            setIsInitialLoading(false);
        }, 500);
    }, []);

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

    const navigateToHome = () => {
        router.push("/");
        router.setParams({ refresh: Date.now().toString() });
        // Clear navigation history after a short delay
        setTimeout(() => {
            router.replace("/");
        }, 100);
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
                    onPress: navigateToHome
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
            {(isLoading || isInitialLoading) && (
                <ActivityIndicator 
                    style={{
                        position: "absolute",
                        top: '50%',
                        left: '50%',
                        transform: [{ translateX: -15 }, { translateY: -15 }],
                        zIndex: 10,
                    }}
                    size={"large"}
                    color="#D4685E"
                />
            )}

            <View style={{ 
                opacity: isInitialLoading ? 0.5 : 1,
                pointerEvents: isInitialLoading ? 'none' : 'auto'
            }}>
                <Text style={styles.label}>Nombre del producto</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    value={product.name}
                    onChangeText={text => setProduct(prev => ({ ...prev, name: text }))}
                    editable={!isInitialLoading}
                />

                <Text style={styles.label}>Descripción</Text>
                <TextInput
                    style={[styles.input, styles.multilineInput]}
                    placeholder="Descripción"
                    value={product.description}
                    onChangeText={text => setProduct(prev => ({ ...prev, description: text }))}
                    multiline
                    editable={!isInitialLoading}
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
                    editable={!isInitialLoading}
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
                    editable={!isInitialLoading}
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
                    onPress={navigateToHome}
                >
                    <Text style={styles.buttonText}>Cancelar</Text>
                </Pressable>
            </View>
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