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

    public static toQueryString(object: { [key: string]: any }): string {
        var str = [];
        for (var p in object)
            if (object.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(object[p]));
            }
        return str.join('&');
    }
}
