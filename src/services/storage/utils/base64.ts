import RNFS from 'react-native-fs';

export const fileToBase64 = (file: File): Promise<string> => {
    // debugger;
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export const base64ToFile = (base64: string, fileName: string): File => {
    const bufferData = Buffer.from(base64, 'base64');
    return new File([bufferData], fileName, { type: 'application/pdf' });
}

export const convertFileToBase64 = async (fileUri: string) => {
    try {
        // Leer el archivo desde la URI y convertirlo a base64
        const fileBase64 = await RNFS.readFile(fileUri, 'base64');

        console.log('Archivo en base64:', fileBase64);
        return fileBase64;
    } catch (error) {
        console.error('Error al convertir el archivo a base64:', error);
    }
};


