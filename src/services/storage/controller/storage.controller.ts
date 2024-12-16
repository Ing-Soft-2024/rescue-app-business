import { storageConsumer } from "@/src/services/client";
import * as FileSystem from "expo-file-system";

class StorageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'StorageError';
    }
}

export default class StorageController {
    static async upload(source: string, base64Data?: string): Promise<string | null> {
        try {
            console.log('Starting upload for source');
            
            let finalBase64: string;
            
            if (base64Data) {
                // Use the provided base64 data directly
                finalBase64 = base64Data;
            } else if (source.startsWith('data:image')) {
                finalBase64 = source.split(',')[1];
            } else {
                // For other cases (like gallery picks), try to read the file
                try {
                    finalBase64 = await FileSystem.readAsStringAsync(source, {
                        encoding: FileSystem.EncodingType.Base64
                    });
                } catch (error) {
                    console.error('Error reading file:', error);
                    throw new StorageError('Unable to read image file');
                }
            }

            // Upload the base64 string to your server
            const response = await storageConsumer.consume('POST', {
                data: {
                    file: finalBase64,
                    fileName: source.split('/').pop() || 'image.jpg'
                }
            });

            return response?.fileName || null;

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
