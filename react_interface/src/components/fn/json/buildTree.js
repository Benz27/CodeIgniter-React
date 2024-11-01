export const buildTree = (jsonArray, config) => {
    // console.log(jsonArray);

        const objectMap = {};
        const jsonArrayCopy = [...jsonArray]
        // Create a map for quick access to objects by their ID

        const modifyData = (typeof config?.modifyData === 'function') ? config.modifyData : (obj) => { return obj };
        // if (typeof config?.modifyData !== 'function') {
        //     modifyData = (obj) => { return obj };
        // }

        jsonArrayCopy.forEach(obj => {
        
            const _id = config?.id ?? "id";
            const _label = config?.label ?? "name";

            const id = obj[_id];
            const label = obj[_label];

            objectMap[id] = { key: id, data: {}, children: [], label: label };


            objectMap[id].data = modifyData({ ...obj });

            //   for (const prop in obj) {

            //   }
        });

        const result = [];
       

        jsonArrayCopy.forEach(obj => {
            const _id = config?.id ?? "id";

            const id = obj[_id];
            obj.parent = (obj.parent === null || obj.parent === id) ? 0 : obj.parent;
            const parentID = obj.parent
            // console.log(obj);
        
            if (parentID !== 0) {
                objectMap[parentID].children.push(objectMap[id]);
            } else {
                result.push(objectMap[id]);
            }
        });
        return result;
  



}

// Example usage
// const inputArray = [
//     {
//         "ID": 1,
//         "Name": "CCC Facilities",
//         "type": "P_FC",
//         "parent": null,
//         "DateCreated": "2023-12-04 13:48:34",
//         "CONST": {
//             "Name": "FACILITY",
//             "type": "P_FC",
//             "SrlNumPrefix": "P-FC"
//         }
//     },
//     {
//         "ID": 4,
//         "Name": "CSA Facilities2",
//         "type": "P_FC",
//         "parent": 4,
//         "DateCreated": "2023-12-05 22:24:01",
//         "CONST": {
//             "Name": "FACILITY",
//             "type": "P_FC",
//             "SrlNumPrefix": "P-FC"
//         }
//     },
//     {
//         "ID": 5,
//         "Name": "CCC Facilities2",
//         "type": "P_FC",
//         "parent": 5,
//         "DateCreated": "2023-12-06 21:53:38",
//         "CONST": {
//             "Name": "FACILITY",
//             "type": "P_FC",
//             "SrlNumPrefix": "P-FC"
//         }
//     }
// ];

// const outputArray = buildTree(inputArray);
// console.log(JSON.stringify(outputArray, null, 2));
