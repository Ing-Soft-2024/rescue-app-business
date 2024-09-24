import { storageConsumer } from "@/src/services/client";
import { base64ToFile, fileToBase64 } from "../utils/base64";
import { eliminarDiacriticos } from "../utils/eliminarDiacriticos";

const baseAPI = process.env['NEXT_PUBLIC_API_URL'] + '/api';
class StorageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'StorageError';
    }
}
export default class StorageController {
    static upload = async (file: File, pathTo?: string): Promise<string | undefined> => {
        if (!file) return undefined;
        const base64File = await fileToBase64(file);
        let fileName = file.name;
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
                    "file": base64File
                }
            });
        } catch {
            throw new StorageError('Hubo un error al subir el archivo');
        }
    }

    static download = async (fileName: string): Promise<File> => {
        if (!fileName) throw new StorageError('No file name Provided');
        const base64File = await storageConsumer.consume("GET", {
            "queryParams": {
                "fileName": fileName
            }
        })
        return base64ToFile(base64File, fileName);
    }
}
