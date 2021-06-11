export default class UtilService {
    public static getStorageItem<T>(key: string): T {
        return JSON.parse(localStorage.getItem(key) as any) as T;
    }
    public static saveStorageItem(key: string, object: any) {
        localStorage.setItem(key, JSON.stringify(object));
    }
}
