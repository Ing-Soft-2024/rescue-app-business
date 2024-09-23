import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet, Pressable } from 'react-native';
import * as ImagePicker from "expo-image-picker";


export interface ImageModalProps {
  onImageSelect: (uri: string) => void; // Prop for selecting image
}

const ImageModal: React.FC<ImageModalProps> = ({onImageSelect}) => {

  
  type PickerType = 'camera' | 'gallery';

  const openPicker = async (type: PickerType) => {
    try {
        if (type === 'camera') {
            await ImagePicker.requestCameraPermissionsAsync();
            const result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.back,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                saveImage(result.assets[0].uri);
            }
        } else if (type === 'gallery') {
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                saveImage(result.assets[0].uri);
            }
        }
    } catch (error) {
        console.error(`Error opening ${type}: `, error);
    }
    closeModal();
};

  

  const saveImage = async (imageUri: string) => {
     onImageSelect(imageUri);
  };

  const openCamera = () => openPicker('camera');
  const openGallery = () => openPicker('gallery');


    const [modalVisible, setModalVisible] = useState(false);
  
    const openModal = () => {
      setModalVisible(true);
    };
  
    const closeModal = () => {
      setModalVisible(false);
    };
  
    return (
      <View>
        
        <Pressable
        onPress={openModal}
        style={({ pressed }) => ({
          backgroundColor: pressed ? "#F69792" : "#F04A41",
          padding: 14,
          borderRadius: 5,
          alignItems: "center"
      })}
        >
                    <Text style={{ color: "white", fontSize: 16 }}>Imagen</Text>
                </Pressable>


        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}

        >
          <View style={styles.overlay}>
            <View style={styles.container}>
              <Text style={styles.modalText}>This is an overlay!</Text>
              <Button title="Close Overlay" onPress={closeModal} />
              <Button title="Camera" onPress={openCamera} />
              <Button title="Galeria" onPress={openGallery} />
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });

  export default ImageModal;