import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
// import { CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { GalleryPicker } from "./components/galleryPicker";

export default function AddProduct() {
    const [status, requestPermision] = ImagePicker.useCameraPermissions();
    const [image, setImages] = React.useState<string>();

    React.useEffect(() => {
        requestPermision();
    }, []);

    const nextStep = () => {
        if (!image) return;

        router.push({
            "pathname": "/product/add",
            "params": {
                "imageUri": image
            }
        });
    }

    return (
        <View
            style={styles.container}
        >
            <View style={{
                position: 'absolute',
                top: 70,
                left: 20,
                zIndex: 10,
            }}>
                <Pressable
                    style={({ pressed }) => ({
                        backgroundColor: pressed ? '#3333' : '#0003',
                        padding: 10,
                        borderRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 5,
                        flexDirection: 'row',
                    })}
                    onPress={router.back}
                >
                    <AntDesign name="arrowleft" size={24} color="white" />
                    <Text style={{ color: "white" }}>Volver</Text>
                </Pressable>
            </View>

            {
                !status && (
                    <View>
                        <Text
                            style={{
                                color: 'white',
                                fontWeight: 'semibold',
                                fontSize: 16,
                                marginBottom: 10,
                            }}
                        >No tienes permiso para usar la cámara</Text>
                        <Pressable
                            style={({ pressed }) => ({
                                backgroundColor: pressed ? '#fafafa' : '#fefefe',
                                padding: 14,
                                borderRadius: 5,
                                alignItems: "center"
                            })}

                            onPress={() => requestPermision()}
                        >
                            <Text>Habilitar</Text>
                        </Pressable>
                    </View>
                )
            }

            {/* <CameraView
                style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: '',
                    overflow: 'hidden',
                }}

                shouldRasterizeIOS={true}
                onCameraReady={() => {
                    console.log("Camera ready");
                }}
            /> */}

            <View style={{
                position: 'absolute',
                bottom: 20,
                padding: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                left: 0,
                right: 0,
                alignItems: 'center',
            }}>
                <GalleryPicker onSelect={setImages} />

                {
                    image && (
                        <Pressable
                            style={({ pressed }) => ({
                                backgroundColor: pressed ? '#3333' : '#0003',
                                padding: 10,
                                borderRadius: 5,
                                overflow: 'hidden',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 5,
                                flexDirection: 'row',
                                width: 60,
                                height: 60,
                            })}
                            onPress={() => setImages(undefined)}
                        >
                            <Image source={{ uri: image }} style={StyleSheet.absoluteFillObject} />
                            <Pressable style={(pressed) => ({
                                ...StyleSheet.absoluteFillObject,
                                backgroundColor: 'black',
                                opacity: pressed ? 0.5 : 0,
                            })} />
                            <FontAwesome6 name="trash" size={20} color="white" />
                        </Pressable>
                    )
                }

                <View>
                    <Pressable style={({ pressed }) => ({
                        backgroundColor: pressed ? '#fafafa' : '#fefefe',
                        padding: 10,
                        borderRadius: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 5,
                        flexDirection: 'row',
                        opacity: image ? 1 : 0.25,
                    })}
                        onPress={nextStep}
                    >
                        <AntDesign
                            name="arrowright"
                            size={24}
                            color="black"
                        />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        "flex": 1,
        "justifyContent": 'center',
        "alignItems": 'center',
        "backgroundColor": '#121212',
    },
});