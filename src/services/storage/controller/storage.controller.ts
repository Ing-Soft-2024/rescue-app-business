import { storageConsumer } from "@/src/services/client";
import * as FileSystem from "expo-file-system";
import { eliminarDiacriticos } from "../utils/eliminarDiacriticos";
class StorageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'StorageError';
    }
}
export default class StorageController {
    static upload = async (file: string, pathTo?: string): Promise<string | undefined> => {
        let fileName = file?.split('/').pop();
        if (!fileName || !file) return undefined;
        const base64 = await FileSystem.readAsStringAsync(file, { encoding: FileSystem.EncodingType.Base64 });

        // if (!FileSystem) return undefined;
        // const base64File = await FileSystem.readAsStringAsync(file, { encoding: FileSystem.EncodingType.Base64 });
        // console.log(base64File);
        const parts = fileName.split('.');
        if (parts.length >= 2) {
            const ext = parts[parts.length - 1];
            parts.pop();
            fileName = parts.join('_');
            fileName += `.${ext}`;
            fileName = fileName.replace(/\s/g, '_');
            fileName = eliminarDiacriticos(fileName);
        }
        fileName = pathTo ? `${pathTo}/${fileName}` : fileName;
        try {
            return storageConsumer.consume("POST", {
                "data": {
                    "fileName": fileName,
                    "file": base64
                }
            });
        } catch {
            throw new StorageError('Hubo un error al subir el archivo');
        }
    }

    static download = async (fileName: string): Promise<string> => {
        if (!fileName) throw new StorageError('No file name Provided');
        const base64File = await storageConsumer.consume("GET", {
            "queryParams": {
                "fileName": fileName
            }
        })
        return `data:image/png;base64,${base64File}`;
    }
}
