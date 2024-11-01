import { getPathValue } from "../json/getPathValue";

// const arr = ["A", "B", "C"];
// const index = arr.indexOf("C");
// const count = (index >= 0) ? index + 1 : arr.length;
// console.log(arr.splice(0, count));



// const getPathValue = (obj, path) =>{
//     const _path = (typeof path === "string") ? path.split(".") : path;
//     let _obj = {...obj};
//     for(const p of _path){
//         _obj = _obj?.[p.trim()] ?? undefined;
//     }
//     return _obj;
// }
// const arr = [
//     {
//         id: "A",
//         prop: {
//             name: "A1"
//         }
//     },
//     {
//         id: "B",
//         prop: {
//             name: "B1"
//         }
//     },
//     {
//         id: "C",
//         prop: {
//             name: "C1"
//         }
//     }
// ];



export const findFromArray = ({ arr, element, path, config }) => {

    const _arr = [...arr];
    let _index = 0;
    let found = false;
    for (const ar of _arr) {
        if (typeof ar === "string") {
            if (ar === element) {
                found = true;
                break;
            }
            _index++;
            continue;
        }
        const deep_ar = getPathValue(ar, path);
        if (deep_ar === element) {
            found = true;
            break;
        }
        _index++;
    }

    const _final_index = (found === true) ? _index : (config?.toLengthInstead) ? _arr.length : -1;
    return { index: _final_index, length: _arr.length }
}


export const findMissingElements = (array1, array2) => {
    const set2 = new Set(array2);

    const missingElements = [];

    for (const a1 of array1) {
        if (!set2.has(a1)) {
            missingElements.push(a1);
        }
    }
    // array1.forEach(element => {
    //     if (!set2.has(element)) {
    //         missingElements.push(element);
    //     }
    // });

    return { missingElements, allIn: missingElements.length === 0 };
}

export const arrReplace = (arr, e, n) => {
    const _arr = (Array.isArray(arr)) ? [...arr] : [];
    const i = _arr.indexOf(e);
    // const c = (i > -1) ? 1 : 0;
    // _arr.splice(i, c);

    if (i > - 1) {
        _arr[i] = n;
    }
    return _arr;
}

export const arrRemove = (arr, e) => {
    const _arr = (Array.isArray(arr)) ? [...arr] : [];
    const i = _arr.indexOf(e);
    const c = (i > -1) ? 1 : 0;
    _arr.splice(i, c);
    return _arr;
}



// console.log(arrRemove(["A", "B", "C"], "C", "D"));