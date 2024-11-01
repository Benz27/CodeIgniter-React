import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef, memo } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { extractPresets } from '../functions/file/extractPresets';
import { propBool } from '../functions/json/propBool';
import { toFileDef } from '../../fs/FileDefinitions';

const FileDefinition = forwardRef(({value, ...props}, componentRef) => {

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

    const onLoading = (typeof props?.onLoading === "function") ? props.onLoading : () => { };
    const onLoad = (typeof props?.onLoad === "function") ? props.onLoad : () => { };
    const onError = (typeof props?.onError === "function") ? props.onError : () => { };
    const onDone = (typeof props?.onDone === "function") ? props.onDone : () => { };
    const onChange = (typeof props?.onChange === "function") ? props.onChange : () => { };


    const video = useRef(null);

    const inputButton = useRef(null);

    const [presets, setPresets] = useState(props?.presets ?? {});
    const [file, setFile] = useState(false);
    const [accept, setAccept] = useState([]);
    const [types, setTypes] = useState([]);
    const [exts, setExts] = useState([]);
    const input = useRef(null);

    let mounted = false;

    useEffect(() => {
        if (mounted) {
            return;
        };
        if(value){
            handleFileValue(value);
        };
        mounted = true;
    }, []);


    useEffect(() => {
        minDuration.current = props?.minDuration ?? null;
    }, [props?.minDuration]);

    useEffect(() => {
        const details = extractPresets({ presets });
        setTypes(details.types);
        setAccept(details.accept);
        setExts(details.exts);
        extsRef.current = details.exts;
        typesRef.current = details.types;
    }, [presets])


    const handleFileChange = async (event) => {
        const value = event.target.files[0];
        handleFileValue(value);
    };


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
        if (file?.duration) {
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
    };

    const readFileContents = (files) => {
        for (const file of files) {
            handleFileValue(file);
            break;
        }
    };

    const dragOverHandler = (event) => {
        event.preventDefault();
    };

    useImperativeHandle(componentRef, () => {
        return {
            click() {
                inputButton.current.click();
            },
        };
    }, []);
    // drag and drop
    return (
        <div className="flex flex-column">
            {((types.length > 0 && types?.[0] === "video") || file?.type === "video") ? <video ref={video} controls src={file?.url ?? ""}></video> :
                ((types.length > 0 && types?.[0] === "image") || file?.type === "image") ? <img src={file?.url ?? ""}></img> : <></>}
            <InputText onDrop={handleDrop} onDragOver={dragOverHandler} readOnly value={file?.name || "Choose a file..."} style={{ cursor: "pointer", textAlign: "center" }} onClick={() => {
                inputButton.current.click();
            }}></InputText>
            <Button onDrop={handleDrop} onDragOver={dragOverHandler} severity='primary' label='Browse from device' onClick={() => {
                inputButton.current.click();
            }}></Button>
            <Button severity='danger' hidden={!file} label='Remove' onClick={() => {
                setFile(false);
            }}></Button>
            <input hidden ref={inputButton} type="file" accept={accept} onChange={handleFileChange} />
        </div>

    )
});

export default FileDefinition;
