const getRawName = (fileName) => {
    const fname = (typeof fileName === "string") ? fileName : "";
    const parts = fname.split(".");
    if(parts.length < 2){
        return {};
    }
    const ext = parts.pop();
    const raw = parts.join(".");
    return { raw, ext };
};

const getDomainFromUrl = (url) => {
    try {
        const urlObject = new URL(url);
        return urlObject.hostname;
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
};
// =============================================================

const firebaseStorage = (url) => {
    const first = url.split("%2F")[1];
    const second = first.split("?alt")[0];
    return second;
};

// =============================================================
const getFileNameFromURL = (url) => {
    const domain = getDomainFromUrl(url);
    const registry = {
        "firebasestorage.googleapis.com": firebaseStorage
    }
    const fn = (typeof registry?.[domain] === "function") ? registry[domain] : () => {return null};
    const name = fn(url);
    return { domain, url, name };
};

// console.log(getFileNameFromURL("https://firebasestorage.googleapis.com/v0/b/dyci-learned.appspot.com/o/Files%2Fdocument_1715243117566?alt=media&token=55c6c9d4-bc5c-426b-ba89-b3b6912e75dd"))

const urlToFileDef = async (url) => {
    console.log("fetching "+url);
    const response = await fetch(url);
    if(response.ok === false){
        return `error loading file from "${url}"`;
    };

    const utc = new Date().getTime();
    const name_from_url = getFileNameFromURL(url);
    const blob = await response.blob();
    const elements = blob.type.split("/");
    const name_details = getRawName(name_from_url.name);
    const name = name_from_url.name;
    const data = {};
    const _file = new File([blob], url?.name, { type: `${elements[0]}/${elements[1]}` });

    console.log("fetched "+url);

    data["name"] = name;
    data["file_name"] = name;
    data["type"] = elements[0];
    data["ext"] = elements[1];
    data["raw_name"] = name_details?.raw ?? name;
    data["ext_name"] = name_details?.ext ?? elements[1];
    data["utc_name"] = `${name_details?.raw ?? name}_${utc}`;
    data["final_name"] = `${name_details?.raw ?? name}_${utc}.${elements[1]}`;

    data["fromURL"] = true;
    data["file"] = _file;
    data["fileDef"] = _file;
    data["blob"] = blob;
    data["url"] = url;
    return data;
}

// =========


const fileToFileDef = async (file) => {
    const elements = file.type.split("/");
    const name_details = getRawName(file.name);
    const data = {}
    const utc = new Date().getTime();

    data["name"] = file.name;
    data["file_name"] = file.name;
    data["type"] = elements[0];
    data["ext"] = elements[1];
    data["raw_name"] = name_details.raw;
    data["utc_name"] = `${name_details?.raw ?? file.name}_${utc}`;
    data["final_name"] = `${name_details?.raw ?? file.name}_${utc}.${elements[1]}`;
    data["ext_name"] = name_details.ext;


    data["fromURL"] = false;

    data["file"] = file;
    data["fileDef"] = file;

    data["blob"] = new Blob([file], { type: file.type });
    data["url"] = URL.createObjectURL(file);
    return data;
}

export const toFileDef = async (value) => {
    const fn = (value instanceof File) ? fileToFileDef : urlToFileDef;
    const data = await fn(value);
    return data;
};
