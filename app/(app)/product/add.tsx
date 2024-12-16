import { productConsumer } from "@/src/services/client";

import { ProductType } from "@/src/types/product.type";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

import { useLocalSearchParams, useRouter } from "expo-router";





import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useBusiness } from "@/src/context/business.context";
import StorageController from "@/src/services/storage/controller/storage.controller";
import React from "react";




const LabeledInput = ({ label, children, ...props }: {
    label: string;
    [key: string]: any;
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


export default function ProductPage() {
    const params = useLocalSearchParams();
    const image = React.useMemo<string>(() => params.imageUri as string, []);
    const imageBase64 = React.useMemo<string>(() => params.imageBase64 as string, []);

    const { business } = useBusiness();

    const [product, setProduct] = React.useState<ProductType>({
        name: '',
        description: '',
        price: 0,
        image: '',
        businessId: business?.id,
        stock: 0,
        createdAt: new Date()
    });

    const router = useRouter();

    const cancelProduct = () => router.back();

    const saveProduct = async () => {
        try {
            if (!image) {
                Alert.alert("Error", "Por favor, seleccione una imagen");
                return;
            }

            console.log('Starting product creation with image:', image);

            const uploadedImageUrl = await StorageController.upload(image, imageBase64).catch(error => {
                console.error('Image upload error:', error);
                Alert.alert("Error", "Error al procesar la imagen");
                return null;
            });

            if (!uploadedImageUrl) {
                return;
            }

            const updatedProduct = {
                ...product,
                image: uploadedImageUrl
            };

            console.log('Sending product data:', updatedProduct);

            const response = await productConsumer.consume('POST', { 
                data: updatedProduct 
            });

            if (response) {
                router.dismissAll();
            } else {
                Alert.alert("Error", "Error al crear el producto");
            }
        } catch (error) {
            console.error('Error creating product:', error);
            Alert.alert(
                "Error",
                "Hubo un error al crear el producto. Por favor, intente nuevamente."
            );
        }
    };

    return (
        <KeyboardAvoidingView style={{
            padding: 5,
            flex: 1,
            gap: 10 
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
        
                <View style={{
                    width: "100%",
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                }}>
                    {image && (
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
                            onPress={() => router.back()}
                        >
                            <Image
                                source={{ uri: image }}
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
                                onChangeText={(text) => setProduct((product) => ({ ...product, name: text }))}
                            />
                        </LabeledInput>
                        <LabeledInput label="Precio">
                            <View style={{ ...styles.input, flexDirection: "row", gap: 5 }}>
                                <FontAwesome name="dollar" size={16} color="black" />
                                <TextInput
                                    style={{ flex: 1 }}
                                    placeholder="Precio"
                                    keyboardType="numeric"
                                    onChangeText={(text) => setProduct((product) => ({ ...product, price: Number(text) }))}
                                />
                            </View>
                        </LabeledInput>
                        <LabeledInput label="Stock">
                            <View style={{ ...styles.input, flexDirection: "row", gap: 5 }}>
                                <FontAwesome name="dollar" size={16} color="black" />
                                <TextInput
                                    style={{ flex: 1 }}
                                    placeholder="Stock"
                                    keyboardType="numeric"
                                    onChangeText={(text) => setProduct((product) => ({ ...product, stock: Number(text) }))}
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

                        onChangeText={(text) => setProduct((product) => ({ ...product, description: text }))}
                        placeholder="Descripción"
                        multiline={true}
                    />
                </LabeledInput>
    
            <KeyboardAvoidingView style={{
                gap: 5,
                marginBottom: 20,
                flex: 1
            }}>
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
            </KeyboardAvoidingView>
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
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 20,
    }
});