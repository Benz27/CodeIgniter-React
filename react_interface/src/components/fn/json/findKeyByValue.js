export function findKeyByValue(obj, targetValue) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === targetValue) {
            return key;
        }
    }
    // If the value is not found, return null or handle accordingly
    return null;
}