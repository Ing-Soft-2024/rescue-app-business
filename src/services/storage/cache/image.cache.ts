import * as FileSystem from 'expo-file-system';

class ImageCacheService {
    private cache: Map<string, string> = new Map();
    private cacheDirectory: string;

    constructor() {
        this.cacheDirectory = `${FileSystem.cacheDirectory}images/`;
        this.ensureCacheDirectory();
    }

    private async ensureCacheDirectory() {
        const dirInfo = await FileSystem.getInfoAsync(this.cacheDirectory);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(this.cacheDirectory, { intermediates: true });
        }
    }

    private getCacheKey(url: string): string {
        return url.replace(/[^a-zA-Z0-9]/g, '');
    }

    private getCachePath(key: string): string {
        return `${this.cacheDirectory}${key}.jpg`;
    }

    async getCachedImage(url: string): Promise<string | null> {
        // Check memory cache first
        if (this.cache.has(url)) {
            return this.cache.get(url) || null;
        }

        // Check file cache
        const key = this.getCacheKey(url);
        const path = this.getCachePath(key);
        
        try {
            const info = await FileSystem.getInfoAsync(path);
            if (info.exists) {
                this.cache.set(url, path);
                return path;
            }
        } catch (error) {
            console.error('Error checking cache:', error);
        }
        
        return null;
    }

    async cacheImage(url: string, base64Data: string): Promise<string> {
        const key = this.getCacheKey(url);
        const path = this.getCachePath(key);

        try {
            await FileSystem.writeAsStringAsync(path, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
            });
            this.cache.set(url, path);
            return path;
        } catch (error) {
            console.error('Error caching image:', error);
            throw error;
        }
    }

    async clearCache(): Promise<void> {
        try {
            await FileSystem.deleteAsync(this.cacheDirectory, { idempotent: true });
            await this.ensureCacheDirectory();
            this.cache.clear();
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }
}

export const imageCache = new ImageCacheService(); 