
export const addNestedProperty = (obj, path, value, config) => {
    const pathArray = path.split('.');
    const reference = obj;
    let currentObj = reference;
    // pathArray.unshift(pathArray[0]);
    // pathArray.push(pathArray[pathArray.length - 1])
    // if (pathArray[0] !== "" && pathArray[0] !== "$") {
    //     pathArray.unshift(pathArray[0]);
    // }

    // console.log(pathArray);
    for (let i = 0; i < pathArray.length - 1; i++) {
        const key = pathArray[i];
        if (!currentObj[key] || typeof currentObj[key] !== 'object') {
            currentObj[key] = {};
        }
        currentObj = currentObj[key];
    }

    const lastKey = pathArray[pathArray.length - 1];
    const _reference = { ...reference };
    // console.log(typeof currentObj[lastKey]);
    const _currentObjRef = (typeof currentObj[lastKey] === "object") ? {...currentObj[lastKey]} : currentObj[lastKey];
    const _value = (typeof value === "function") ? value(_reference, _currentObjRef) : value;
    currentObj[lastKey] = (_value === undefined) ? null : _value;
    // if (typeof value === "function") {
    //     // if(lastKey !== "$"){
    //     // }
    //     // currentObj[lastKey] = {};
    //     // currentObj = currentObj[lastKey];
    //     currentObj[lastKey] = value(_currentObj);

    // } else {
    //     currentObj[lastKey] = value;
    // }

    return reference;
}

// const modify = (data, current) => {
//     // current["jujutsu"] = "kaisen";
//     console.log(data);
//     return current;
// }

// const existingJSON = {
//     name: "John Doe",
//     age: 30,
//     address: {
//         city: "Example City",
//         postalCode: "12345",
//     },
//     hobbies: ["reading", "coding", "traveling"],
// };

// const ref = addNestedProperty(existingJSON, "address.postalCode", modify);
// const jsonString = JSON.stringify(ref, null, 2);

// console.log(jsonString);
