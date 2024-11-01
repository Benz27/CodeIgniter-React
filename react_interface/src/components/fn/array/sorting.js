export const bubbleSortWithLogs = (arr, order = 'ascending', callback, config) => {
    if (!Array.isArray(arr)) {
        throw new Error('Input is not an array.');
    }

    if (order !== 'ascending' && order !== 'descending') {
        throw new Error('Invalid order. Use "ascending" or "descending".');
    }

    callback = (typeof callback === "function") ? callback : () => { };


    const sortedArray = (config?.reference) ? arr : [...arr];
    const changes = [];

    for (let i = 0; i < sortedArray.length - 1; i++) {
        for (let j = 0; j < sortedArray.length - 1 - i; j++) {
            const current = sortedArray[j];
            const next = sortedArray[j + 1];

            const shouldSwap = order === 'ascending' ? current > next : current < next;

            if (shouldSwap) {
                [sortedArray[j], sortedArray[j + 1]] = [sortedArray[j + 1], sortedArray[j]];
                callback(j, j + 1);
                changes.push({ index1: j, index2: j + 1, order });
            }
        }
    }

    return { sortedArray, changes };
}

export const sortPartners = (arrays) => (index1, index2) => {

    for (const arr of arrays) {
        [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
    }

}
