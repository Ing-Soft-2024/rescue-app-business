import { FontAwesome } from "@expo/vector-icons";
import { Image, KeyboardAvoidingView, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import ImageModalProps from "@/src/components/images/imageModal";
import ImageModal from "@/src/components/images/imageModal";


const LabeledInput = ({ label, children, ...props }: {
    label: string;
    [key: string]: any;
    children: React.ReactNode
}) => (
    <View style={{ gap: 2 }}>
        <Text style={styles.label}>{label}</Text>
        {children}
    </View>
)



export default function ProductPage() {
     const [image, setImage] = useState<string | null>();

    const handleImageSelect = (imageUri: string) => {
        setImage(imageUri); // Update the state with the selected image URI
    };

    return (

        
        
        <KeyboardAvoidingView style={{
            padding: 5,
            flex: 1,
            gap: 10
        }}>
        
            <LabeledInput label="Nombre">
                <TextInput style={styles.input} placeholder="Nombre" />
            </LabeledInput>
            <LabeledInput label="Descripción">
                <TextInput
                    style={{
                        ...styles.input,
                        height: 150,
                    }}
                    placeholder="Descripción"
                    multiline={true}
                />
            </LabeledInput>
            <LabeledInput label="Precio">
                <View style={{ ...styles.input, flexDirection: "row", gap: 5 }}>
                    <FontAwesome name="dollar" size={16} color="black" />
                    <TextInput
                        style={{ flex: 1 }}
                        placeholder="Precio"
                        keyboardType="numeric"
                    />
                </View>
            </LabeledInput>

            <View style={{
                gap: 10
            }}>
                 


                {/* <Image source={image ? {image} : uri: "https://tr.rbxcdn.com/97406b6891c98069d3dd80e7be2dd8f0/420/420/Image/Png"}
                style = {styles.image}
                /> */}
                <SafeAreaView>
                {/*<ImageModalProps onImageSelect={handleImageSelect}></ImageModalProps>*/}
                <ImageModal onImageSelect={handleImageSelect}></ImageModal>
                </SafeAreaView>
            {image && (
                    <Image
                        source={{ uri: image }}
                        style={styles.image}
                    />
                )}
                


                <Pressable
                    style={({ pressed }) => ({
                        backgroundColor: pressed ? "#333" : "#000",
                        padding: 14,
                        borderRadius: 5,
                        alignItems: "center"
                    })}
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
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
    },

    label: {
        fontSize: 14,
        fontWeight: "bold"
    },

    image:
    {
        width: 200,
    height: 200,
    marginTop: 20,
    }
});