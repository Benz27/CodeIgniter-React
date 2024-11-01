import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef, createContext, useContext, Children } from 'react';
import { useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from 'primereact/checkbox';

const FieldCheckBoxContext = createContext();

const useFieldCheckBoxContext = () => {
    return useContext(FieldCheckBoxContext);
}


export const FieldCheckBox = forwardRef(function FieldCheckBox(props, ref) {

    const formContextValues = useFormContext();
    const { watch, getValues, fieldValues, fieldDynamicConfig, DCKey } = useFormContext();
    const fieldProps = new FieldProperties(props, formContextValues);
    const [defaultConfig, setDefaultConfig] = useState({
        readOnly: props?.readOnly ?? false,
        disabled: props?.disabled ?? false,
        rules: { required: props?.rules?.required ?? props?.required ?? false, },

    });
    const [dynamicConfig, setDynamicConfig] = useState({
    });
    const [config, setConfig] = useState(defaultConfig);
    const value = props["value"] ? props["value"] : "";
    const hasChildren = Children.count(props.children) > 0;
    // console.log("hasChildren", hasChildren);
    const [cBoxValue, setCBoxValue] = useState([]);
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
        await fieldProps.setFFVal(fieldValues, (value) => {
            const _value = (Array.isArray(value)) ? value : [];
            console.log(_value);
            return _value;
        });

        setCBoxValue(getValues(fieldProps.getField()));

    }
    useEffect(() => {
        handleFieldValue(fieldValues);
    }, [fieldValues]);


    useEffect(() => {

        // console.log(getValues(fieldProps.getField()));
        setCBoxValue(getValues(fieldProps.getField()));
        // console.log(getValues(fieldProps.getField()));
    }, [watch(fieldProps.getField())]);

    const context_value = {
        fieldProps,
        field: fieldProps.getField(),
        cBoxValue, setCBoxValue,
        config
    }

    return (
        <div className="flex flex-column align-items-center">

            <div>
                {(config.rules.required === true) ? (<span className='text-danger'><b>*</b> </span>
                ) : (<></>)}
                <LabelField field={fieldProps.getField()} label={fieldProps.getLabel()} />

            </div>            
            <FieldCheckBoxContext.Provider value={context_value}>
                {(hasChildren === true) ?
                    (<>
                        {props.children}
                    </>) :
                    (<>
                        <Item value={value}></Item>
                    </>)}
            </FieldCheckBoxContext.Provider>
            {/*  */}
            {/* <Checkbox
                name={fieldProps.getField()}
                onChange={handleOnChange}
                className={fieldProps.toggleErrClass(errors)}
                value={value}
                disabled={config?.disabled ?? false}
                checked={checked}
            /> */}

            {/* <RadioButton
                // inputId={fieldProps.getField()} 
                name={fieldProps.getField()}
                onChange={handleOnChange}
                className={fieldProps.toggleErrClass(errors)}
                value={value}
                disabled={config?.disabled ?? false}
                checked={checked}
            /> */}

            {/*  */}

            {/* <HelperField helper={fieldProps.getHelper()} /> */}


            <ErrorField field={fieldProps.getField()} />

        </div>
    )


});
const Item = (props) => {
    const { cBoxValue, setCBoxValue, fieldProps, field, toggleErrClass, config } = useFieldCheckBoxContext();
    const { errors } = useFormContext();
    const value = props?.value ?? field;
    const [checked, setChecked] = useState(false);
    const valueHandler = useRef(null);

    const handleValueChange = (value) => {
        let _values = cBoxValue;
        let check = false;
        // console.log(_values);
        if (!_values.includes(value)) {
            _values.push(value);
            check = true;
        }
        else {
            _values.splice(_values.indexOf(value), 1);
        }
        // console.log(_values);
        return _values;
    }

    useEffect(() => {
        return () => {
            if (Array.isArray(cBoxValue)) {
                let _values = [...cBoxValue].filter(function (element) {
                    return element !== value;
                });
                fieldProps.setFieldVal(_values);
            }
        }
    }, [])


    useEffect(() => {
        valueHandler.current = handleValueChange;
        let _values = (Array.isArray(cBoxValue)) ? cBoxValue : [];
        setChecked(_values.includes(value));
    }, [cBoxValue]);

    const handleOnChange = (e) => {
        if (!config?.readOnly) {
            // console.log(e?.target?.value ?? e?.value);
            fieldProps.setAndCall(valueHandler.current(e?.target?.value ?? e?.value));
        }
    }

    return (<>

        <Checkbox
            name={field}
            onChange={handleOnChange}
            className={fieldProps.toggleErrClass(errors)}
            value={value}
            disabled={config?.disabled ?? false}
            checked={checked}
        />
    </>)


}


FieldCheckBox["Item"] = Item;



// const Test = ["A", "B", "C"];

// const i = Test.indexOf("A");
// let newArray = Test.filter(function(element) {
//     return element !== "A";
// });

// console.log(newArray);