import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { FormContextProvider, useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { extractPresets } from '../functions/file/extractPresets';
import { propBool } from '../functions/json/propBool';
import { toFileDef } from '../../fs/FileDefinitions';
import FileDefinition from '../components/FileDefinition';

export const FieldFileList = forwardRef(function FieldFileList(props, ref) {

    const formContextValues = useFormContext();
    const { errors, getValues, fieldValues, setError, clearErrors, fieldDynamicConfig, DCKey } = useFormContext();
    const fieldRef = useRef(null);
    const fieldProps = new FieldProperties(props, formContextValues, fieldRef);
    const fileInputRef = useRef(null);
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
    const [dynamicConfig, setDynamicConfig] = useState({
    });
    const [config, setConfig] = useState(defaultConfig);
    const [files, setFiles] = useState([]);
    useEffect(() => {
        setDynamicConfig(fieldProps.registerDynamicConfig(fieldDynamicConfig, defaultConfig));
    }, [fieldDynamicConfig]);

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
        // console.log(getValues(fieldProps.getField()));
        const value = getValues(fieldProps.getField());
        setFiles(Array.isArray(value) ? value : []);
    };
    useEffect(() => {
        handleFieldValue(fieldValues);
    }, [fieldValues]);

    useEffect(() => {
        // console.log(files);
        fieldProps.setFieldVal(files);
    }, [files]);

    // =======================================================================================
    return (
        <>
            <Button type="button" className="mx-2" onClick={() => {
                fileInputRef.current.click();
            }} label="Add" icon="pi pi-plus" severity="success"></Button>
            <input type='file'
                multiple
                ref={fileInputRef}
                hidden
                onChange={(event) => {
                    const files = [];
                    for (const file of event.target.files) {
                        files.push(file);
                    };
                    setFiles((prev) => {
                        const hold = Array.isArray(prev) ? [...prev] : [];
                        hold.push(...files);
                        return hold;
                    });
                }}
            ></input>

            <div className="row bg-transparent justify-content-center">
                {files.map((file, index) => (
                    <div className="col-lg-3 card m-2 p-0">
                        <FileDefinition value={file} onLoad={(file) => {
                            setFiles((prev) => {
                                const hold = [...prev];
                                hold[index] = file;
                                return hold;
                            });
                        }} key={index}></FileDefinition>
                    </div>
                ))}
            </div>
        </>

    );
});