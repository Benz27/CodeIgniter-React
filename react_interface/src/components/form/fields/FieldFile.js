import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { extractPresets } from '../functions/file/extractPresets';
import { propBool } from '../functions/json/propBool';
import { toFileDef } from '../../fs/FileDefinitions';

export const FieldFile = forwardRef(function FieldFile(props, ref) {

    const formContextValues = useFormContext();
    const { errors, getValues, fieldValues, setError, clearErrors, fieldDynamicConfig, DCKey } = useFormContext();

    const fieldRef = useRef(null);
    const fieldProps = new FieldProperties(props, formContextValues, fieldRef);

    const minDuration = useRef(null);
    const typesRef = useRef(null);
    const extsRef = useRef(null);


    const video_duration = (value) => {
        const _minDuration = minDuration.current;
        if (value.type !== "video") {
            return undefined;
        }
        if (_minDuration === null) {
            return undefined;
        }
        if (!value.duration) {
            return "Video duration was not set. An error might have occured loading the file.";
        }
        if (_minDuration < value.duration) {
            return `Video duration should not exceed ${_minDuration} seconds.`;
        }
        return undefined;
    };

    const allowedFiles = (value) => {
        const _types = typesRef.current;
        const _exts = extsRef.current;
        // console.log(_types, value, props.field);

        if (_types.length <= 0 && _exts.length <= 0) {
            return undefined;
        };
        if (!value?.type) {
            return "File type not defined. An error might have occured loading the file.";
        };
        if (_types.includes(value.type) === false) {
            return "File type not allowed.";
        };
        return undefined;
    };

    const [defaultConfig] = useState({
        disabled: props?.disabled ?? false,
        rules: {
            required: props?.rules?.required ?? props?.required ?? false,
            validate: {
                // allowedFiles,
                // video_duration
            }
        },
    });

    const onLoading = (typeof props?.onLoading === "function") ? props.onLoading : () => { };
    const onLoad = (typeof props?.onLoad === "function") ? props.onLoad : () => { };
    const onError = (typeof props?.onError === "function") ? props.onError : () => { };
    const onDone = (typeof props?.onDone === "function") ? props.onDone : () => { };



    const [hidden, setHidden] = useState(propBool(props, "hidden"));
    useEffect(() => {
        setHidden(propBool(props, "hidden"));
    }, [props?.hidden]);



    useEffect(() => {
        console.log(hidden);
    }, [hidden])
    const video = useRef(null);



    const inputButton = useRef(null);
    const [dynamicConfig, setDynamicConfig] = useState({
    });
    const [config, setConfig] = useState(defaultConfig);

    const [presets, setPresets] = useState(props?.presets ?? {});
    const [file, setFile] = useState(false);
    const [accept, setAccept] = useState([]);
    const [types, setTypes] = useState([]);
    const [exts, setExts] = useState([]);
    const input = useRef(null);

    const checkAllowed = (types, exts, file) => {

        if (types.length <= 0 && exts.length <= 0) {
            return true;
        };

        if (!file?.type) {
            return false;
        };

        if (types.includes(file.type) === false) {
            return false;
        };

        return true;
    };


    useEffect(() => {
        minDuration.current = props?.minDuration ?? null;
    }, [props?.minDuration]);

    useEffect(() => {
        setDynamicConfig(fieldProps.registerDynamicConfig(fieldDynamicConfig, defaultConfig));
    }, [fieldDynamicConfig]);

    useEffect(() => {
        const details = extractPresets({ presets });

        setTypes(details.types);
        setAccept(details.accept);
        setExts(details.exts);
        extsRef.current = details.exts;
        typesRef.current = details.types;
    }, [presets])


    useEffect(() => {
        fieldProps.registerComponents({
            config: config
        });

        return () => {
            fieldProps.unMount();
        };

    }, []);

    useEffect(() => {

        const nConfig = dynamicConfig?.[DCKey] ?? defaultConfig;
        setConfig(nConfig);

    }, [dynamicConfig, DCKey]);


    const handleFieldValue = async (fieldValues) => {
        await fieldProps.setFFVal(fieldValues);
        await handleFileValue(getValues(fieldProps.getField()));
    }

    useEffect(() => {
        handleFieldValue(fieldValues);
    }, [fieldValues]);

    useImperativeHandle(fieldRef, () => {
        return {
            async options(value) {
                await value;
                console.log(value);
            },
            value(justCode) {
                if (justCode) {
                    // return selectedOption;
                }
            }
        };
    }, []);

    const handleFileChange = async (event) => {
        const value = event.target.files[0];
        handleFileValue(value);
    }

    useEffect(() => {
        clearErrors([fieldProps.getField()]);
        if (file["allowed"] === false) {
            setError(fieldProps.getField(), { type: 'allowedFiles', message: 'File type not allowed.' });
        };
        fieldProps.setFieldVal(file);
    }, [file]);


    const handleFileValue = async (value) => {
        onLoading();
        const _file = await toFileDef(value);
        _file["allowed"] = checkAllowed(types, exts, { type: _file.type, ext: _file.ext });
        if (_file["allowed"] === false) {
            const _response = "File type not allowed.";
            onError(_response);
            onDone(false, _response);
            return;
        };
        if(file?.duration){
            _file["duration"] = file.duration;
        };
        setFile(_file);
        onLoad(_file);
        onDone(true, _file);
    };

    useEffect(() => {

        if (video?.current?.addEventListener) {
            video.current.addEventListener('loadedmetadata', () => {
                const _video = video.current;
                if (_video.hasOwnProperty('duration')) {
                    const durationInSeconds = _video.duration;
                    setFile((prev) => {
                        const hold = { ...prev };
                        hold["duration"] = durationInSeconds;
                        return hold;
                    });
                };
            })
        };
    }, [video?.current]);

    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        readFileContents(files);
    }

    const readFileContents = (files) => {
        for (const file of files) {
            handleFileValue(file);
            break;
        }
    }

    const dragOverHandler = (event) => {
        event.preventDefault();
    }

    useImperativeHandle(ref, () => {
        return {
            click() {
                inputButton.current.click();
            },
        };
    }, []);
    // drag and drop
    return (
        <>
            {(hidden === false) ? (
                <div className="flex flex-column" >
                    <div >
                        {(config.rules.required === true) ? (<span className='text-danger'><b>*</b> </span>
                        ) : (<></>)}
                        <LabelField field={fieldProps.getField()} label={fieldProps.getLabel()} />
                    </div>

                    {((types.length > 0 && types?.[0] === "video") || file?.type === "video") ? <video ref={video} controls src={file?.url ?? ""}></video> :
                        ((types.length > 0 && types?.[0] === "image") || file?.type === "image") ? <img src={file?.url ?? ""}></img> : <></>}

                    <InputText onDrop={handleDrop} onDragOver={dragOverHandler} readOnly value={file?.name || "Choose a file..."} style={{ cursor: "pointer", textAlign: "center" }} onClick={() => {
                        inputButton.current.click();
                    }} className={fieldProps.toggleErrClass(errors)}></InputText>
                    <Button onDrop={handleDrop} onDragOver={dragOverHandler} severity='primary' label='Browse from device' onClick={() => {
                        inputButton.current.click();
                    }}></Button>

                    <Button severity='danger' hidden={!file || hidden || propBool(props, "showClear") === true} label='Remove' onClick={() => {
                        setFile(false);
                    }}></Button>
                    <HelperField helper={fieldProps.getHelper()} />
                    <ErrorField field={fieldProps.getField()} />
                </div>
            ) : (<></>)}

            <input hidden ref={inputButton} type="file" accept={accept} onChange={handleFileChange} />

        </>

    )
});


// const pp = ["A"];
// console.log((pp.length > 0 && pp?.[0] === "A"))

// function getDomainFromUrl(url) {
//     try {
//         // Create a new URL object
//         const urlObject = new URL(url);
//         // Return the hostname which includes the domain
//         return urlObject.hostname;
//     } catch (error) {
//         // If the URL is invalid, return null or handle the error as needed
//         console.error('Invalid URL:', error);
//         return null;
//     }
// }

// // Example usage
// const url = "https://firebasestorage.googleapis.com/v0/b/dyci-learned.appspot.com/o/Files%2Fdocument_1715243117566?alt=media&token=55c6c9d4-bc5c-426b-ba89-b3b6912e75dd";
// const domain = getDomainFromUrl(url);
// console.log(domain);