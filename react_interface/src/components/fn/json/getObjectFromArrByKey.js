export function getObjectFromArrByKey(array, key) {
    for (const obj of array) {
      if (obj.hasOwnProperty(key)) {
        return obj[key];
      }
    }
    return false;
}