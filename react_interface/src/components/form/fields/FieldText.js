import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { InputText } from "primereact/inputtext";
import { propBool } from '../functions/json/propBool';




export const FieldText = forwardRef(function FieldText(props, ref) {


    const formContextValues = useFormContext();
    const { errors, getValues, fieldValues, fieldDynamicConfig, DCKey } = useFormContext();

    const fieldRef = useRef(null);
    const fieldProps = new FieldProperties(props, formContextValues, fieldRef);
    const [defaultConfig, setDefaultConfig] = useState({
        readOnly: props?.readOnly ?? false,
        disabled: props?.disabled ?? false,
        lowercase: props.hasOwnProperty("lowercase") ? (props?.lowercase === undefined) ? true : props?.lowercase : false,
        rules: { required: props?.rules?.required ?? propBool(props, "required"), },
        noast: propBool(props, "noast"),
        startLabel: (!props?.startLabel) ? [] : (Array.isArray(props.startLabel)) ? props.startLabel : [props.startLabel],
        endLabel: (!props?.endLabel) ? [] : (Array.isArray(props.endLabel)) ? props.endLabel : [props.endLabel],
        // endLabel: props?.endLabel ?? [],
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
        fieldProps.registerFieldMod();
    }, []);

    useEffect(() => {
        fieldProps.registerComponents({
            config: config
        });
        // console.log("con")

        return () => {
            fieldProps.unMount();
            // console.log("m/unm", fieldProps.getField())
        };

    }, []);

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
        // console.log("fieldValues", fieldValues);
        handleFieldValue(fieldValues);
    }, [fieldValues]);



    useEffect(() => {
        input.current.value = defaultValue;

    }, [defaultValue]);

    const handleTextConfig = (value) => {

    }


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

    // useEffect(()=>{
    //     console.log(config.startLabel)
    // }, [config.startLabel])
    return (
        <div className="flex flex-column align-items-start">

            <div>
                {(config.rules.required === true && config.noast === false) ? (<span className='text-danger'><b>*</b> </span>
                ) : (<></>)}
                <LabelField field={fieldProps.getField()} label={fieldProps.getLabel()} />

            </div>

            {/*  */}
            <div className='p-inputgroup flex-1'>

                {config.startLabel.map((item, index) => (
                    <span className="p-inputgroup-addon">{item}</span>
                ))}

                <InputText id={fieldProps.getField()}
                    ref={input}
                    className={fieldProps.toggleErrClass(errors)}
                    placeholder={fieldProps.getPlaceHolder()}
                    readOnly={config?.readOnly ?? false}
                    disabled={config?.disabled ?? false}
                    onChange={fieldProps.setValOnChange} />

                {config.endLabel.map((item, index) => (
                    <span className="p-inputgroup-addon">{item}</span>
                ))}

                {/* <span className="p-inputgroup-addon">@dyci.edu.ph</span> */}

            </div>



            {/*  */}

            <HelperField helper={fieldProps.getHelper()} />


            <ErrorField field={fieldProps.getField()} />

        </div>
    )


});
