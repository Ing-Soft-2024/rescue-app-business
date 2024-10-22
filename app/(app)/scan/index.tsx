import { AntDesign } from "@expo/vector-icons";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";


export default function ScanPage() {
    const router = useRouter();
    const [
        cameraPermission,
        requestCameraPermissions,
    ] = useCameraPermissions();

    const scannerRef = React.useRef<CameraView>(null);

    const onQrCodeScanned = (params: BarcodeScanningResult) => {
        console.log(params.data);
        if(!params.data) return;
        const url = params.data;
        const isValidUrl = url.startsWith("rescueappbusiness://scan/scannedOrder?id=");
        if(!isValidUrl) return;

        const id = url.split("id=")[1];
        router.push({
            "pathname": "/scan/scannedOrder",
            "params": {
                "id": id
            }
        });
    }
        
    useFocusEffect(
        React.useCallback(() => {
            requestCameraPermissions();
        }, []));

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#121212',
        }}>
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
            <CameraView 
                style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: '',
                    overflow: 'hidden',
                }}

                shouldRasterizeIOS={true}
                barcodeScannerSettings={{
                    barcodeTypes: [
                        "qr"
                    ]
                }}

                onBarcodeScanned={onQrCodeScanned}
                ref={scannerRef}
            /> 

            {/* 
                QR Code Scanner Square to center the QR code scanner
            */}
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
                zIndex: 10,
                borderRadius: 10,
            }}>
                <View style={{
                    width: 250,
                    height: 250,
                    borderColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                }}>
                </View>
            </View>

        </View>
    )
}