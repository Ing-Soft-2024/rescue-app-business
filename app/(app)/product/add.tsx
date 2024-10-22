import { productConsumer } from "@/src/services/client";

import { ProductType } from "@/src/types/product.type";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

import { useLocalSearchParams, useRouter } from "expo-router";





import { Image, KeyboardAvoidingView, Pressable,Platform, SafeAreaView, StyleSheet, Text, TextInput, View, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";

import ImageModalProps from "@/src/components/images/imageModal";
import ImageModal from "@/src/components/images/imageModal";
import StorageController from "@/src/services/storage/controller/storage.controller";
import React from "react";




const LabeledInput = ({ label, children, ...props }: {
    label: string;
    [key: string]: any;
    children: React.ReactNode
}) => (
    <View style={{ gap: 2, flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        {children}
    </View>
)


export default function ProductPage() {

    const params = useLocalSearchParams();
    const image = React.useMemo<string>(() => params.imageUri as string, []);

    const [product, setProduct] = React.useState<ProductType>({
        name: '',
        description: '',
        price: 0,
        image: '',
        businessId: 1,
        createdAt: new Date()
    });

    const router = useRouter();

    const cancelProduct = () => router.back();

    const saveProduct = () => {

        if (!image) return;
        StorageController.upload(image!)
            .then((image) => {
                if (!image) return;
                product.image = image;
                return productConsumer.consume('POST', { data: product });
            }).then(() => router.dismissAll())
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
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
    },

    label: {
        fontSize: 14,

        fontWeight: "semibold"

        
    },

    image:
    {
        width: 200,
        height: 200,
        marginTop: 20,

    }
});