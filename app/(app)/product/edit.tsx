import { useBusiness } from "@/src/context/business.context";
import { productDetailsConsumer } from "@/src/services/client";
import { ProductType } from "@/src/types/product.type";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const LabeledInput = ({ label, children }: {
    label: string;
    children: React.ReactNode
}) => (
    <View style={{ 
        gap: 5,
        minHeight: 70,
        marginBottom: 10,
    }}>
        <Text style={styles.label}>{label}</Text>
        {children}
    </View>
)

export default function EditProductPage() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const { business } = useBusiness();

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

    const cancelProduct = () => router.back();

    const validateProduct = (): boolean => {
        // Check for empty fields
        if (!product.name.trim()) {
            Alert.alert("Error", "El nombre del producto es requerido");
            return false;
        }

        if (!product.description.trim()) {
            Alert.alert("Error", "La descripción del producto es requerida");
            return false;
        }

        // Check if price is a valid number and greater than 0
        if (isNaN(product.price) || product.price <= 0) {
            Alert.alert("Error", "El precio debe ser un número mayor a 0");
            return false;
        }

        // Check if stock is a valid number and not negative
        if (isNaN(product.stock) || product.stock < 0) {
            Alert.alert("Error", "El stock debe ser un número mayor o igual a 0");
            return false;
        }

        return true;
    };

    const handlePriceChange = (text: string) => {
        const number = parseFloat(text);
        if (text === '' || isNaN(number)) {
            setProduct(prev => ({ ...prev, price: 0 }));
        } else {
            setProduct(prev => ({ ...prev, price: number }));
        }
    };

    const handleStockChange = (text: string) => {
        const number = parseInt(text, 10);
        if (text === '' || isNaN(number)) {
            setProduct(prev => ({ ...prev, stock: 0 }));
        } else {
            setProduct(prev => ({ ...prev, stock: number }));
        }
    };

    const saveProduct = async () => {
        try {
            if (!validateProduct()) {
                return;
            }

            await productDetailsConsumer.consume('POST', {
                params: { id: product.id },
                data: product
            });
            router.back();
            // Add a small delay to ensure the previous screen is ready
            setTimeout(() => {
                router.setParams({ refresh: Date.now().toString() });
            }, 100);
        } catch (error) {
            console.error('Error saving product:', error);
            Alert.alert(
                "Error",
                "Hubo un error al guardar el producto. Por favor, intente nuevamente."
            );
        }
    };

    return (
        <KeyboardAvoidingView 
            style={{ padding: 5, flex: 1, gap: 10 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={{
                width: "100%",
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
            }}>
                {product.image && (
                    <Pressable
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 5,
                            overflow: 'hidden',
                            position: 'relative',
                            marginTop: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={{ uri: product.image }}
                            style={StyleSheet.absoluteFillObject}
                        />
                        <View style={{
                            ...StyleSheet.absoluteFillObject,
                            backgroundColor: 'black',
                            opacity: 0.5,
                        }} />
                        <FontAwesome6 name="arrows-rotate" size={22} color="white" />
                    </Pressable>
                )}
                <View style={{
                    flex: 1,
                    gap: 20,
                    padding: 5,
                }}>
                    <LabeledInput label="Nombre">
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            value={product.name}
                            onChangeText={(text) => setProduct(prev => ({ ...prev, name: text }))}
                        />
                    </LabeledInput>
                    <LabeledInput label="Precio">
                        <View style={{ ...styles.input, flexDirection: "row", gap: 5 }}>
                            <FontAwesome name="dollar" size={16} color="black" />
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Precio"
                                value={String(product.price)}
                                keyboardType="numeric"
                                onChangeText={handlePriceChange}
                            />
                        </View>
                    </LabeledInput>
                    <LabeledInput label="Stock">
                        <View style={{ ...styles.input, flexDirection: "row", gap: 5 }}>
                            <FontAwesome name="dollar" size={16} color="black" />
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="Stock"
                                value={String(product.stock)}
                                keyboardType="numeric"
                                onChangeText={handleStockChange}
                            />
                        </View>
                    </LabeledInput>
                </View>
            </View>

            <LabeledInput label="Descripción">
                <TextInput
                    style={{
                        ...styles.input,
                        height: 150,
                    }}
                    value={product.description}
                    onChangeText={(text) => setProduct(prev => ({ ...prev, description: text }))}
                    placeholder="Descripción"
                    multiline={true}
                />
            </LabeledInput>

            <View style={{ gap: 5, marginTop: 'auto', marginBottom: 20 }}>
                <Pressable
                    style={({ pressed }) => ({
                        backgroundColor: pressed ? "#333" : "#000",
                        padding: 14,
                        borderRadius: 5,
                        alignItems: "center"
                    })}
                    onPress={saveProduct}
                >
                    <Text style={{ color: "white", fontSize: 16 }}>Guardar</Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => ({
                        backgroundColor: pressed ? "#F69792" : "#F04A41",
                        padding: 14,
                        borderRadius: 5,
                        alignItems: "center"
                    })}
                    onPress={cancelProduct}
                >
                    <Text style={{ color: "white", fontSize: 16 }}>Cancelar</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: "#f9f9f9",
        padding: 10,
        minHeight: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    label: {
        fontSize: 14,
        fontWeight: "semibold",
        marginBottom: 5,
    }
});