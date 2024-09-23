import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const ImageModal: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
  
    const openModal = () => {
      setModalVisible(true);
    };
  
    const closeModal = () => {
      setModalVisible(false);
    };
  
    return (
      <View style={styles.container}>
        <Button title="Image" onPress={openModal} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        
        >
          <View style={styles.overlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>This is an overlay!</Text>
              <Button title="Close Overlay" onPress={closeModal} />
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