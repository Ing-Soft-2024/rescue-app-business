import { storageConsumer } from "../../client";
import * as FileSystem from 'expo-file-system';

export default class StorageController {
    static async upload(source: string, base64Data?: string): Promise<string | null> {
        try {
            console.log('Starting upload for source:', source);
            
            let finalBase64: string;
            let fileName: string;
            
            if (base64Data) {
                finalBase64 = base64Data;
                // Extract filename from source path
                fileName = source.split('/').pop() || `${Date.now()}.jpg`;
            } else if (source.startsWith('data:image')) {
                finalBase64 = source.split(',')[1];
                fileName = `${Date.now()}.jpg`;
            } else {
                try {
                    finalBase64 = await FileSystem.readAsStringAsync(source, {
                        encoding: FileSystem.EncodingType.Base64
                    });
                    fileName = source.split('/').pop() || `${Date.now()}.jpg`;
                } catch (error) {
                    console.error('Error reading file:', error);
                    return null;
                }
            }

            console.log('Uploading file:', fileName);

            const response = await storageConsumer.consume('POST', {
                data: {
                    file: finalBase64,
                    fileName: fileName
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Upload response:', response);

            if (!response) {
                throw new Error('No response from server');
            }

            return response;

        } catch (error) {
            console.error('Error in upload:', error);
            throw error;
        }
    }

    static download = async (fileName: string): Promise<string> => {
        if (!fileName) throw new StorageError('No file name Provided');
        const base64File = await storageConsumer.consume("GET", {
            queryParams: {
                fileName: fileName
            }
        });
        return `data:image/png;base64,${base64File}`;
    }
}
