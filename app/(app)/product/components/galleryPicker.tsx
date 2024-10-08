import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export const GalleryPicker = ({
    onSelect
}: {
    onSelect?: (uri: string) => void;
}) => {
    const [status, requestPermision] = ImagePicker.useMediaLibraryPermissions();

    const openGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (result.canceled) return;

        onSelect?.(result.assets[0].uri);
        return result;
    }


    React.useEffect(() => {
        requestPermision();
    });

    return (
        <Pressable
            style={({ pressed }) => ({
                ...styles.container,
                backgroundColor: pressed ? '#333' : '#000',
                opacity: status ? 1 : 0.5,
                transform: [{ "scale": status ? 1 : 0.5 }],
                position: 'relative'
            })}
            onPress={openGallery}
        >
            <View style={{
                ...styles.container,
                position: 'absolute',
                top: -5,
                left: -7,
                backgroundColor: 'white',
            }} />

            <View style={{
                ...styles.container,
            }} />
        </Pressable>
    );
}


const styles = StyleSheet.create({
    container: {
        "width": 55,
        "height": 55,
        "justifyContent": 'center',
        "alignItems": 'center',
        "backgroundColor": '#333',
        "borderRadius": 8,
    },
});