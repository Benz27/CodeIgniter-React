import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { Image } from 'primereact/image';


export const FieldImage = forwardRef(function FieldText(props, ref) {

    const formContextValues = useFormContext();
    const { errors, getValues, fieldValues, afterSubmit, fieldDynamicConfig, DCKey } = useFormContext();

    const fieldRef = useRef(null);
    const fieldProps = new FieldProperties(props, formContextValues, fieldRef);
    const [defaultConfig, setDefaultConfig] = useState({
        disabled: props?.disabled ?? false,
        rules: { required: props?.rules?.required ?? props?.required ?? false, },

    });

    const [dynamicConfig, setDynamicConfig] = useState({
    });

    const [config, setConfig] = useState(defaultConfig);
    const [preview, setPreview] = useState(null);
    const [blob, setBlob] = useState(false);
    const input = useRef(null);
    afterSubmit(() => {
        setBlob(false);
    });

    useEffect(() => {
        setDynamicConfig(fieldProps.registerDynamicConfig(fieldDynamicConfig, defaultConfig));
        // console.log("fieldDynamicConfig", fieldDynamicConfig);
    }, [fieldDynamicConfig]);


    useEffect(() => {
        fieldProps.registerComponents({
            config: config
        });

        return () => {
            fieldProps.unMount();
        };

    }, [config]);

    useEffect(() => {

        const nConfig = dynamicConfig?.[DCKey] ?? defaultConfig;
        setConfig(nConfig);


    }, [dynamicConfig, DCKey]);


    useEffect(() => {
        // console.log("fieldValues", fieldValues);
        fieldProps.setFFVal(fieldValues);
        setPreview(getValues(fieldProps.getField()));
        setBlob(false);
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

    const handleImageChange = async (event) => {
        const value = event.target.files[0];
        const response = await fetch(URL.createObjectURL(value));
        if(!response.ok){
            console.error("error processing image");
            return;
        }


        const _blob = await response.blob();
        setBlob(_blob);
        setPreview(response.url);
    }

    useEffect(()=>{
        fieldProps.setFieldVal(blob);

    },[blob])



    return (
        <div className="flex flex-column">

            <LabelField field={fieldProps.getField()} label={fieldProps.getLabel()} />

            {/*  */}

            <Image id={fieldProps.getField()}
                src={preview}
                height='100px'
                className={fieldProps.toggleErrClass(errors)}
                disabled={config?.disabled ?? false}
            />

            <input type="file" onChange={handleImageChange} accept="image/*" />

            {/*  */}

            <HelperField helper={fieldProps.getHelper()} />
            <ErrorField field={fieldProps.getField()} />
        </div>
    )
});
