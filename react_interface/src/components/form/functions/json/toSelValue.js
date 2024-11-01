export const toSelValue = (jsonObject, codeKeyString, namekeyString, codeAlias, nameAlias) => {


    // console.log(codeKeyString, namekeyString);
    if (typeof jsonObject === "string" || typeof jsonObject === "number" || typeof jsonObject === "boolean") {
        jsonObject = { code: jsonObject, name: jsonObject };
    }

    const codekeys = codeKeyString.split('.');
    let code = { ...jsonObject };
    codekeys.forEach(codekey => {
        code = code[codekey.trim()];
    });
    if (code === undefined) {
        code = jsonObject?.["code"] ?? undefined;
    }

    const namekeys = namekeyString.split('.');
    let name = { ...jsonObject };
    namekeys.forEach(namekey => {
        name = name[namekey.trim()];
    });
    if (name === undefined) {
        name = jsonObject?.["name"] ?? undefined;
    }


    let newObj = { name: name, code: code }

    if (nameAlias) {
        newObj = { ...newObj, [nameAlias]: name };

    }
    if (codeAlias) {
        newObj = { ...newObj, [codeAlias]: code };
    }

    // console.log(newObj);
    return {...newObj, ...jsonObject};


}

export const arrayToSelValue = (jsonArray, codeKeyString, namekeyString, codeAlias, nameAlias) => {

    const result = [];
    const jsonArrayCopy = [...jsonArray || []];

    jsonArrayCopy.forEach(obj => {
        result.push(toSelValue(obj, codeKeyString, namekeyString, codeAlias, nameAlias))
    });

    // console.log(result);
    return result;

}

export const getJSONVal = (jsonObject, keyString) => {
    const keys = keyString.split('.');


    let value = { ...jsonObject };
    keys.forEach(key => {


        value = value?.[key.trim()] ?? undefined;


    });

    return value;

}


// 


export const toAutoCompValue = (jsonObject, valueKeyString, labelkeyString) => {


    const valuekeys = valueKeyString.split('.');
    const labelkeys = labelkeyString.split('.');


    let value = { ...jsonObject };

    valuekeys.forEach(valuekey => {
        value = value[valuekey.trim()];
    });



    let label = { ...jsonObject };
    labelkeys.forEach(labelkey => {
        label = label[labelkey.trim()];
    });

    if (value === undefined) {
        value = jsonObject?.["value"] ?? undefined;
    }

    if (label === undefined) {
        label = jsonObject?.["label"] ?? undefined;
    }


    return { label: label, value: value }


}

export const arrayToAutoCompValue = (jsonArray, valueKeyString, labelkeyString) => {

    // console.log(jsonArray);
    const result = [];
    const jsonArrayCopy = [...jsonArray];
    console.log(jsonArray);

    jsonArrayCopy.forEach(obj => {
        result.push(toAutoCompValue(obj, valueKeyString, labelkeyString))
    });

    // console.log(result);
    return result;

}

// console.log(getJSONVal({SAM:{"BENZ":"BENZZZ"}}, "SAM.BENsZ"));



// console.log(arrayToSelValue([
//     {
//       "ID": 1,
//       "Name": "CCC Facilities",
//       "type": "P_FC",
//       "parent": null,
//       "DateCreated": "2023-12-04 13:48:34",
//       "CONST": {
//         "Name": "FACILITY",
//         "type": "P_FC",
//         "SrlNumPrefix": "P-FC"
//       }
//     },
//     {
//       "ID": 4,
//       "Name": "CSA Facilities",
//       "type": "P_FC",
//       "parent": 1,
//       "DateCreated": "2023-12-05 22:24:01",
//       "CONST": {
//         "Name": "FACILITY",
//         "type": "P_FC",
//         "SrlNumPrefix": "P-FC"
//       }
//     }
//   ], "CONST.type", "Name"));
// const test = "A";
// const test2 = {"B":"b"}
// console.log({
//     ...test2,
//     [test]:"a",
// })

