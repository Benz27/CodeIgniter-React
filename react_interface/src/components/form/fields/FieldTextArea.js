import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { InputTextarea } from "primereact/inputtextarea";
import { propBool } from '../functions/json/propBool';

export const FieldTextArea = forwardRef(function FieldTextArea(props, ref) {

    const formContextValues = useFormContext();
    const { errors, getValues, fieldValues, fieldDynamicConfig, DCKey } = useFormContext();

    const fieldProps = new FieldProperties(props, formContextValues);

    const [defaultConfig, setDefaultConfig] = useState({
        readOnly: props.hasOwnProperty("readOnly") ? (props?.readOnly === undefined) ? true : props?.readOnly : false,
        disabled: props.hasOwnProperty("disabled") ? (props?.disabled === undefined) ? true : props?.disabled : false,
        rules: { required: props?.rules?.required ?? propBool(props, "required"), },
        rows: props?.rows ?? 5,
        cols: props?.cols ?? 30,
    });
    const [dynamicConfig, setDynamicConfig] = useState({
    });

    const [config, setConfig] = useState(defaultConfig);
    const [defaultValue, setDefaultValue] = useState("");


    const input = useRef(null);
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


    const handleFieldValue = async (fieldValues) => {
        await fieldProps.setFFVal(fieldValues);
        setDefaultValue(getValues(fieldProps.getField()));
        input.current.value = getValues(fieldProps.getField());
    }
    useEffect(() => {
        handleFieldValue(fieldValues);
    }, [fieldValues]);


    useEffect(() => {
        input.current.value = defaultValue;
    }, [defaultValue]);
    // useEffect(() => { field mmProps.setDefaultValue(defaultValues) }, [defaultValues]);


    return (
            <div className="flex flex-column align-items-start">

                <div>
                    {(config.rules.required === true) ? (<span className='text-danger'><b>*</b> </span>
                    ) : (<></>)}
                    <LabelField field={fieldProps.getField()} label={fieldProps.getLabel()} />

                </div>
                {/*  */}

                <InputTextarea id={fieldProps.getField()}
                    ref={input}
                    className={fieldProps.toggleErrClass(errors)}
                    placeholder={fieldProps.getPlaceHolder()}
                    readOnly={config?.readOnly ?? false}
                    disabled={config?.disabled ?? false}
                    onChange={fieldProps.setValOnChange}
                    rows={config?.rows ?? 5}
                    cols={config?.cols ?? 30}
                />

                {/*  */}

                <HelperField helper={fieldProps.getHelper()} />


                <ErrorField field={fieldProps.getField()} />

            </div>

    )


});
