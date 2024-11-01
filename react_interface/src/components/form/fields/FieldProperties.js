import { useFormContext } from '../contexts/FormContext';
import _ from 'lodash';
import { getJSONVal } from '../functions/json/toSelValue';
import { useEffect } from 'react';
export class FieldProperties {
    constructor(props, formContextValues, ref) {
        this.field = this.defineValue(props["field"]);
        this.label = this.defineValue(props["label"]);
        this.placeholder = this.defineValue(props["placeholder"]);
        this.className = this.defineValue(props["className"]);


        this.onChange = (typeof props?.onChange === "function") ? props.onChange : async (value) => { return value };

        this.helper = props.helper ? props.helper : false;
        this.validateOnChange = props.hasOwnProperty("validateOnChange") ? (props?.validateOnChange === undefined) ? true : props?.validateOnChange : false;
        // this.id = this.defineValue(props["id"]);
        // this.id = this.defineValue(props["id"]);
        // 
        this.filterFieldValue = (typeof props?.filterFieldValue === "function") ? props.filterFieldValue : async (value) => { return value };
        this.filterSubmitValue = (typeof props?.filterSubmitValue === "function") ? props.filterSubmitValue : (value) => { return value };


        this.errors = formContextValues.errors;
        this.setValue = formContextValues.setValue;

        this.register = formContextValues.register;
        this.unregister = formContextValues.unregister;
        this.registerFieldErrorMessages = formContextValues.registerFieldErrorMessages;
        this.unRegisterFieldErrorMessages = formContextValues.unRegisterFieldErrorMessages;
        
        
        this.watch = formContextValues.watch;
        this.control = formContextValues.control;

        // this.registerFieldAndClusterValue = formContextValues.registerFieldAndClusterValue;
        // this.unregisterFieldAndClusterValue = formContextValues.unregisterFieldAndClusterValue;
        // propComp
        this.prop_rules = props?.rules ?? {};
        this.prop_config = props?.config ?? {};
        this.prop_errorMsg = props?.errorMsg ?? {};
        this.prop_defaultValues = props?.value ?? null;

        this.FVKey = props?.FVKey ?? props?.field;

        // field config
        this.components = null;
        this.rules = null;
        this.config = {};
        this.dynamicConfig = {};

        this.errorMsg = null;
        this.defaultValues = null;
        this.isRegister = false;
        // 
        this.defaultConfig = {};

        // this.defaultValues = formContextValues.defaultValues;
        // this.setDefaultValues = formContextValues.setDefaultValues;
        this.messages = props?.messages ?? {};

        if(this.messages?.required === undefined){
            this.messages["required"] = "This field is required.";
        };

        if(this.messages?.min === undefined){
            this.messages["min"] = "This field is lower than its minimum limit.";
        };

        if(this.messages?.max === undefined){
            this.messages["max"] = "This field is higher than its maximum limit.";
        };

        if(this.messages?.pattern === undefined){
            this.messages["pattern"] = "This field does not match the pattern criteria.";
        };

        this.toggleErrorClass = formContextValues.toggleErrorClass;
        this.unRegisterFieldModification = formContextValues.unRegisterFieldModification;
        this.trigger = formContextValues.trigger;
        // this.registerField();

        this.refsRegistry = formContextValues.refsRegistry;
        this.registerRef = formContextValues.registerRef;
        this.unregisterRef = formContextValues.unregisterRef;

        this.getValues = formContextValues.getValues;
        this.ref = null;


        this.formDefaultValues = formContextValues.defaultValues;


        this.registerFieldModification = formContextValues.registerFieldModification;




        if (ref != undefined) {
            this.ref = ref;
        }

    }


    // config

    registerFieldMod(filterSubmitValue) {
        const fn = (typeof filterSubmitValue === "function") ? filterSubmitValue : this.filterSubmitValue;
        this.registerFieldModification(this.field, fn);
    }

    getConfig() {
        return this.config;
    }












    setDefaultConfig(obj) {
        this.defaultConfig = obj;
    };


    getConfig(key, config) {


        if (config.hasOwnProperty(key)) {
            return config[key];
        }
        if (this.defaultConfig.hasOwnProperty(key)) {
            return this.defaultConfig[key];
        }

        return null;

    }

    setDefaultConfigByKey(key, value) {
        this.defaultConfig[key] = value;
    };


    propExist(obj, name) {
        if (obj.hasOwnProperty(name)) {
            return true;
        };

        return false;
    };

    compareOBJ(newData, data) {

        if (newData === undefined) {
            return false;
        };

        // if (!newData.hasOwnProperty(this.field)) {
        //     return false;
        // };

        if (_.isEqual(newData, data)) {
            return true;
        };
        return false;
    };
    compareComponents(data) {
        const isSame = {
            rules: false,
            defaultValues: false,
            errorMsg: false,
            register: false,
            config: false,
        };
        if (!data.hasOwnProperty(this.field)) {
            return;
        };

        const components = data[this.field];

        if (this.compareOBJ(components["register"], this.isRegister)) {
            isSame.register = true;
        };

        if (this.compareOBJ(components["rules"], this.rules)) {
            isSame.rules = true;
        };

        if (this.compareOBJ(components["config"], this.config)) {
            isSame.config = true;
        };

        if (this.compareOBJ(components["errorMsg"], this.errorMsg)) {
            isSame.errorMsg = true;
        };

        if (this.compareOBJ(components["defaultValues"], this.defaultValues)) {
            isSame.defaultValues = true;
        };

        return isSame;
    };

    getValue() {
        return this.getValues(this.field);
    }

    isFieldRegistered = (fieldName) => {
        const fieldState = this.getValues(fieldName); // Get the value of the field

        // Check if the field is registered by checking its state
        return fieldState !== undefined && fieldState !== null;
    };

    async setFFVal(fieldValues, modify, config) {

        const callOnChange = config?.callOnChange ?? true;
        if (this.isFieldRegistered === false) {
            this.rawRegister();
        }

        if (typeof modify !== 'function') {
            modify = (obj) => { return obj };
        }

        const JSONVal = getJSONVal(fieldValues, this.FVKey);

        // if(!JSONVal){
        //     return;
        // }

        let value = (JSONVal !== undefined) ? JSONVal : null;
        value = await this.filterFieldValue(value);
        // console.log(value);
        const modified = modify(value);
        // console.log(this.field, modified);
        // this.setFieldVal(modified, { noValidation: true });
        this.setValue(this.field, modified);
        if (modified !== undefined && modified !== null && callOnChange === true) {
            this.handleOnChange(modified);
        }
        this.formDefaultValues[this.field] = modified;
    };

    setAndCall(value, setter) {
        // console.log(value);
        this.setFieldVal(value);
        if (typeof setter === "function") {
            setter(value);
        }
        this.handleOnChange(value);
    }

    rawRegister() {

        this.config = this.prop_config;

        this.isRegister = this.isRegister;

        this.rules = this.prop_rules;

        this.errorMsg = this.prop_errorMsg;

        this.defaultValues = this.prop_defaultValues;

        this.components = {};


        this.registerField();
        this.registerRef(this.field, this.ref);
        this.setFieldVal(this.defaultValues);



    }


    checkIfExist(data) {
        if (data?.[this.field] === undefined || data?.[this.field] === null) {

            return false;
        };
    }




    registerComponents(data) {

        const _value = this.getValues(this.field);
        if (data === undefined) {
            data = {};
        }

        this.rules = data?.config?.rules ?? {};
        this.registerField();
        if (_value !== undefined) {
            this.setValue(this.field, _value);
        }
        this.formDefaultValues[this.field] = "";
        this.registerFieldErrorMessages(this.field, this.messages);
    };

    setStaticProps() {

    };





    getComponents(type) {
        if (type !== undefined || type !== null) {
            return this.components[type];
        };

        return this.components;
    }



    // 
    registerField() {

        // if (this.cluster_value !== null) {
        //     this.registerClusterField({ field: this.field, value: this.cluster_value })
        // }
        // this.registerFieldAndClusterValue({ field: this.field, rules: this.rules, value: this.cluster_value });
        // console.log("reg", this.field);
        this.register(this.field, this.rules);


    }

    getDefaultValue(defaultValues) {
        return (defaultValues.hasOwnProperty(this.field)) ? defaultValues[this.field] : '';
    }

    setDefaultValue(defaultValues, secondValue) {

        if (defaultValues.hasOwnProperty(this.field)) {
            this.setFieldVal(defaultValues[this.field]);
            return;
        }

        if (secondValue) {
            this.setFieldVal(secondValue);
            return;
        }
    }


    setRules(rules) {
        this.rules = rules;
    }

    getRules() {
        return this.rules;
    };
    // getAllDefaultValues(){
    //     return this.defaultValues;
    // }


    getErrorMessage(errors) {
        return this.errorMsg[errors[this.field]["type"]];
    };

    toggleErrClass(errors, customErrClass, customClass) {

        // this.toggleErrorClass(errors, this.field, this.className);

        const errorClass = (customErrClass) ? ' ' + customErrClass : ' p-invalid'
        const className = (customClass) ? customClass : this.className;

        return errors[this.field] ? (className + ' w-100 ' + errorClass) : `${this.className} w-100 ${className}`;
    }




    defineValue(value) {
        return value ? value : '';
    }


    setFieldVal(value) {
        this.setValue(this.field, value);
        if (this.validateOnChange === true) {
            this.validate();
        }
    }


    getField() {
        return this.field;
    }

    getHelper() {
        return this.helper;
    }

    getLabel() {
        return this.label;
    }

    getPlaceHolder() {
        return this.placeholder;
    }

    getClassName() {
        return this.className;
    }

    handleOnChange = (e, ...custom) => {
        if (typeof this.onChange === 'function') {
            this.onChange(e, ...custom);
        }
    }


    setValOnChange = (e, fieldVal, ...custom) => {

        this.handleOnChange(e, ...custom);

        let value = (e?.target) ? e.target.value : null;

        if (fieldVal) {
            value = fieldVal;
        }

        this.setFieldVal(value);

    }
    // 


    registerDynamicConfig(fieldDynamicConfig, defaultConfig) {


        if (fieldDynamicConfig?.Specific?.[this.field]) {
            return fieldDynamicConfig?.Specific?.[this.field];
        }

        // ========


        const dynamicConfig = {};
        const All = fieldDynamicConfig?.All ?? {};

        const param = Object.keys(defaultConfig);

        for (let config in All) {
            dynamicConfig[config] = _.cloneDeep(defaultConfig);
            for (let key in All[config]) {
                if (param.includes(key)) {
                    dynamicConfig[config][key] = All[config][key];
                }
            }
        }




        return dynamicConfig;

    }

    validate() {
        // console.log("validation");
        this.trigger(this.field);
        // const custom_errors = {};
        // for (const [key, value] of Object.entries(this.rules)) {
        //     const result = value.method(this.getValue());
        //     if (typeof result === "boolean") {
        //         if (result === false) {
        //             custom_errors[key] = { type: value.type, ref: { name: key, value: nData[key] ?? nData }, message: value?.message ?? "Invalid value" };
        //             setError(key, custom_errors[key]);
        //         }
        //         continue;
        //     }






        //     console.warn(`fieldValidation: method used in '${key}' is not a boolean! Found: ${result}`);
        // }
    }


    unMount() {
        // console.log("unreg", this.field);

        this.unregisterRef(this.field);
        this.unregister(this.field);
        this.unRegisterFieldModification(this.field);
        this.unRegisterFieldErrorMessages(this.field);
        // this.unregisterFieldAndClusterValue({ field: this.field, value: this.cluster_value, onUnRegister: this.onUnregister, onClusterUnRegister: this.onClusterUnRegister })

    }

}

export const HelperField = ({ helper }) => {

    return (
        <>
            {
                helper && (
                    <small id={helper + "-helper"}>
                        {helper}
                    </small>
                )
            }
        </>
    );
}

export const LabelField = ({ field, label, className }) => {

    const cName = className ? className : "";

    return (<label htmlFor={field} className={cName}>{label}</label>)
}

export const ErrorField = ({ field }) => {

    const { errors, errorMessages } = useFormContext();
    
    // useEffect(()=>{
    //     console.log(errors[field]);
    // }, [errors[field]]);


    return (
        <>
            {
                errors[field] && (
                    <span className="text-danger text-small">{errors[field]?.message || (errorMessages?.[field]?.[errors[field].type] ?? "Invalid value!")}</span>
                )
            }

        </>
    )

}

export const addToValues = (hostArray, value) => {
    if (!Array.isArray(hostArray)) {
        hostArray = [];
    }


    const clonedArray = [...hostArray];
    clonedArray.push(value);
    return clonedArray;
}


export const removeFromValues = (hostArray, value) => {

    if (!Array.isArray(hostArray)) {
        hostArray = [];
    }

    const clonedArray = [...hostArray];
    const index = clonedArray.indexOf(value);
    if (index !== -1) {
        clonedArray.splice(index, 1);
    }
    return clonedArray;
}

export const getIndexFromValues = (hostArray, value) => {

    if (!Array.isArray(hostArray)) {
        return false;
    }

    const clonedArray = [...hostArray];
    const index = clonedArray.indexOf(value);
    if (index !== -1) {
        return index;
    }
    return false;
}
