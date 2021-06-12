export default class UtilService {
    public static getStorageObjectItem<T>(key: string): T | null {
        const value = localStorage.getItem(key);
        try {
            return JSON.parse(value as string) as T;
        } catch {
            return null;
        }
    }
    public static getStorageItem(key: string): string | null {
        return localStorage.getItem(key);
    }
    public static saveStorageItem(key: string, object: any) {
        localStorage.setItem(key, JSON.stringify(object));
    }
}
