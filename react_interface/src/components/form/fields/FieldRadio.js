import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef, createContext, useContext, Children } from 'react';
import { useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { RadioButton } from "primereact/radiobutton";
const FieldRadioContext = createContext();

const useFieldRadioContext = () => {
    return useContext(FieldRadioContext);
}

export const FieldRadio = forwardRef(function FieldRadio(props, ref) {

    const formContextValues = useFormContext();
    const { errors, getValues, watch, fieldValues, fieldDynamicConfig, DCKey } = useFormContext();
    const fieldProps = new FieldProperties(props, formContextValues);

    const [defaultConfig, setDefaultConfig] = useState({
        readOnly: props?.readOnly ?? false,
        disabled: props?.disabled ?? false,
        rules: { required: props?.rules?.required ?? props?.required ?? false, },

    });

    const [dynamicConfig, setDynamicConfig] = useState({
    });
    const [radioValue, setRadioValue] = useState(null);

    const [config, setConfig] = useState(defaultConfig);
    const value = props["value"] ? props["value"] : "";

    const hasChildren = Children.count(props.children) > 0;

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

    }, [config]);

    useEffect(() => {
        const nConfig = dynamicConfig?.[DCKey] ?? defaultConfig;
        setConfig(nConfig);
    }, [dynamicConfig, DCKey]);

    const handleFieldValue = async (fieldValues) => {
        await fieldProps.setFFVal(fieldValues);
        setRadioValue(getValues(fieldProps.getField()));
    }

    useEffect(() => {
        handleFieldValue(fieldValues);
    }, [fieldValues]);


    useEffect(() => {
        setRadioValue(getValues(fieldProps.getField()));
    }, [watch(fieldProps.getField())]);


    const context_value = {
        radioValue, setRadioValue,
        fieldProps,
        field: fieldProps.getField(),
        config
    }

    return (
        <div className="flex flex-column align-items-center">

            {/*  */}


            <div>
                {(config.rules.required === true) ? (<span className='text-danger'><b>*</b> </span>
                ) : (<></>)}
                <LabelField field={fieldProps.getField()} label={fieldProps.getLabel()} />

            </div>
            <FieldRadioContext.Provider value={context_value}>
                {props.children}
            </FieldRadioContext.Provider>
            {/*  */}

            {/* <HelperField helper={fieldProps.getHelper()} /> */}


            <ErrorField field={fieldProps.getField()} />

        </div>
    )


});

const Item = (props) => {
    const { radioValue, setRadioValue, fieldProps, field, config } = useFieldRadioContext();
    const { errors } = useFormContext();
    const value = props?.value ?? field;
    const label = props?.label ?? "";
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        return () => {
            // setChecked(radioValue === value);
            if (radioValue === value) {
                fieldProps.setFieldVal(null);
            }
        }
    }, [])


    useEffect(() => {
        // let _values = (Array.isArray(cBoxValue)) ? cBoxValue : [];
        // setChecked(_values.includes(value));
        setChecked(radioValue === value);
    }, [radioValue]);

    const handleOnChange = (e) => {
        if (!config?.readOnly) {
            fieldProps.setAndCall(e?.target?.value ?? e?.value);
        }
    }

    return (<>
        <label>{label}</label>
        <RadioButton
            // inputId={fieldProps.getField()} 

            name={fieldProps.getField()}
            onChange={handleOnChange}
            className={fieldProps.toggleErrClass(errors)}
            value={value}
            disabled={config?.disabled ?? false}
            checked={checked}
        />

    </>)

}

FieldRadio["Item"] = Item;