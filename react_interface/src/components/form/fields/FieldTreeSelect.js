import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { TreeSelect } from 'primereact/treeselect';
import { buildTree } from '../../fn/json/buildTree';

export const FieldTreeSelect = forwardRef(function FieldTreeSelect(props, ref) {

    const formContextValues = useFormContext();
    const { errors, getValues, fieldValues, fieldDynamicConfig, DCKey } = useFormContext();

    const fieldProps = new FieldProperties(props, formContextValues);




    const [selectedNodeKey, setSelectedNodeKey] = useState(null);
    const [defaultConfig, setDefaultConfig] = useState({
        readOnly: props?.readOnly ?? false,
        disabled: props?.disabled ?? false,
        showClear: props?.showClear ?? false,
        rules: { required: props?.rules?.required ?? props?.required ?? false, },

    });

    const [dynamicConfig, setDynamicConfig] = useState({
    });

    const [config, setConfig] = useState(defaultConfig);

    const [nodes, setNodes] = useState(null);

    useEffect(() => {
        if (props?.nodes) {
            let nNodes = null;

            if (typeof props?.Nodes === 'function') {
                const fetchData = async () => {
                    try {
                        nNodes = await props?.nodes();

                        setNodes(nNodes);
                    } catch (error) {
                        console.error('Error running props.nodes:', error);

                    }
                };

                fetchData();

                return;
            }

            nNodes = props?.nodes ?? null;


            setNodes(nNodes);

        }
        // return arrayToSelValue(nOptions, selCode || "code", selName || "name");
    }, [props?.nodes])




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
        setSelectedNodeKey(getValues(fieldProps.getField()));
    }
    useEffect(() => {
        handleFieldValue(fieldValues);
    }, [fieldValues]);


    const validateSetNodes = (value) => {

        if (value.constructor === Array) {
            setNodes(buildTree(value));

            return;
        }
        setNodes([]);
    }

    useImperativeHandle(ref, () => {
        return {
            async nodes(value) {
                await value;

                validateSetNodes(value);
            },
            setSelectedNode(value) {
                setSelectedNodeKey(value);
            },
            say(data) {
                console.log(data);
            }

        };
    }, []);

    // useEffect(() => { field mmProps.setDefaultValue(defaultValues) }, [defaultValues]);

    const handleOnChange = (e) => {

        if (!config?.readOnly) {
            fieldProps.setAndCall(e.value, setSelectedNodeKey);
            // setSelectedNodeKey(e.value);
        }


    }





    // useEffect(() => {

    //     console.log(selectedNodeKey);

    // }, [selectedNodeKey])



    const showClear = (props.hasOwnProperty("showClear")) ? props.showClear : false;










    return (
        <div className="flex flex-column align-items-start">

            <div>
                {(config.rules.required === true) ? (<span className='text-danger'><b>*</b> </span>
                ) : (<></>)}
                <LabelField field={fieldProps.getField()} label={fieldProps.getLabel()} />

            </div>
            {/*  */}


            <TreeSelect value={selectedNodeKey} onChange={handleOnChange} options={nodes}
                filter className={fieldProps.toggleErrClass(errors)}
                showClear={config?.showClear ?? false}
                placeholder={fieldProps.getPlaceHolder()}
            ></TreeSelect>

            {/*  */}

            <HelperField helper={fieldProps.getHelper()} />


            <ErrorField field={fieldProps.getField()} />

        </div>
    )


});
