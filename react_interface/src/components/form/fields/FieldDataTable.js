import React, { createContext, useContext, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { FormContextProvider, useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { NavLink } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Menu } from 'primereact/menu';
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete } from "primereact/autocomplete";
import { Tree } from 'primereact/tree';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { arrayToAutoCompValue } from '../functions/json/toSelValue';

import _ from 'lodash';

const FieldDataTableContext = createContext();

export function useFieldDataTableContext() {
    return useContext(FieldDataTableContext);
}

export const ItemTable = forwardRef(function ItemTable(props, ref) {
    const { Items, handleSetItems, setItems, dt, openNew, confirmDeleteSelected, submittedItem, selectedItems, setSelectedItems, globalFilter, setGlobalFilter,
        setConfig, config, fieldProps, setVal, ItemDialog, setFilters, filters, createId, handleOnValueChange } = useFieldDataTableContext();


    // 

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">


        </div>
    );


    const LeftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2 py-0">
                {(config?.showAddButton) ?
                    <Button type="button" disabled={config.disabled} label="New" style={{ height: '35px' }} icon="pi pi-plus" severity="success" onClick={openNew} />
                    : null}
                {(config?.showDeleteButton) ?
                    <Button type="button" disabled={(config.disabled) || (!selectedItems || !selectedItems.length)} label="Delete" style={{ height: '35px' }} icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} />
                    : null}

                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" style={{ height: '35px' }} onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                </span>
            </div>
        );
    };

    return (
        <div className="flex flex-column align-items-start">
            <div>
                {(config.rules.required === true) ? (<span className='text-danger'><b>*</b> </span>
                ) : (<></>)}
                <LabelField field={fieldProps.getField()} label={fieldProps.getLabel()} />

            </div>

            <div className='card flex flex-column my-2'>


                {/* <div className={fieldProps.toggleErrClass(errors, "border-danger", "card-header py-3 border")}> */}
                {/* <h5 className="m-0 font-weight-bold text-primary"> ASD</h5> */}
                {/* <LabelField field={fieldProps.getField()} label={fieldProps.getLabel()} className={"h5 mx-5 mt-4 mb-0 font-weight-bold text-primary"} /> */}
                {/* <span className='text-danger text-small'>ASD</span> */}
                {/* <ErrorField field={fieldProps.getField()} /> */}

                {/* </div> */}
                <div className="card-body">
                    <Toolbar className="mb-4" start={LeftToolbarTemplate}></Toolbar>


                    <DataTable ref={dt} value={Items} selection={selectedItems} onSelectionChange={(e) => setSelectedItems(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} globalFilter={globalFilter} header={header}
                        onValueChange={handleOnValueChange}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Items"

                        filters={filters} filterDisplay="menu"
                    >

                        {config.hasOwnProperty("selection") ?
                            <Column selectionMode={config?.selectionMode ?? "single"} exportable={false}></Column>

                            : null}

                        {props.children}

                        {config.hasOwnProperty("showActionColumn") ?
                            <Column body={ActionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>

                            : null}

                    </DataTable>
                </div>
            </div>
        </div>
    )
});

const setMenuItems = (menuItems) => {

    const mItem = {};
    const mItems = [];

    menuItems.forEach((element) => {

        mItem["label"] = element.label;
        mItem["items"] = setSubItems(element.items);
        mItems.push(mItem);
    });
    // console.log(mItems);
    return mItems;

};

const setSubItems = (sItems) => {
    const nItems = [];

    sItems.forEach((element) => {

        if (element.hasOwnProperty("navlink")) {
            const template = {
                template: null
            };
            const navlink = element.navlink;
            // console.log(navlink.label);
            template.template = (item, options) => {
                return (
                    <NavLink
                        className="nav-link"
                        // onClick={handleOnclick}
                        to={navlink.route}
                    >
                        <div className='text-dark'>{navlink.label}</div>
                    </NavLink>
                );
            }
            nItems.push(template);
        }
    })

    return nItems;
}



export const TableMenuBar = ({ model, label }) => {
    const menuLeft = useRef(null);
    return (<div className="card flex justify-content-center">
        <Menu model={setMenuItems(model)} popup ref={menuLeft} id="popup_menu_left" />
        <Button type='button' label={label} icon="pi pi-align-left" className="mr-2" onClick={(event) => menuLeft.current.toggle(event)} aria-controls="popup_menu_left" aria-haspopup />
    </div>)
}

// Datatable column built in body templates
const getSeverity = (Item) => {
    switch (Item.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};

export const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export const autocompleteTemplate = (rowData) => {
    return rowData.label;
};

export const imageBodyTemplate = (rowData) => {
    return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
};

export const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.price);
};

export const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
};

export const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>;
};

export const selectFieldBodyTemplate = (rowData) => {
    return rowData.name;
};

export const ActionBodyTemplate = (rowData) => {
    const { editItem, confirmDeleteItem } = useFieldDataTableContext();
    return (
        <React.Fragment>
            <Button type="button" icon="pi pi-pencil" rounded outlined className="mr-2" style={{ height: '30px', width: '30px' }} onClick={() => editItem(rowData)} />
            <Button type="button" icon="pi pi-trash" rounded outlined severity="danger" style={{ height: '30px', width: '30px' }} onClick={() => confirmDeleteItem(rowData)} />
        </React.Fragment>
    );
};

export const ColumnTreeFilterTemplate = (mainField, options) => {
    const { config } = useFieldDataTableContext();
    const handleOnSelectionChange = (e) => {
        options.filterCallback(toOptionValue(e.value));
    };
    const toSelectionKeys = (value) => {
        if (value === null) {
            return;
        };
        const data = [];
        value.forEach((val) => {
            data[val.data] = { checked: true, partialChecked: false, label: val.label };
        });
        return data;
    };
    const toOptionValue = (val) => {
        if (val === null) {
            return;
        };
        const data = [];
        for (const [key, value] of Object.entries(val)) {
            if (config["treeVals"][mainField].hasOwnProperty(key)) {
                data.push({ label: config["treeVals"][mainField][key].label, data: key });
            }
            data.push({ label: null, data: key });
        };
        console.log(config["treeVals"][mainField]);
        return data;
    };
    return (
        <div className="card flex justify-content-center">
            <Tree value={config["treeNodes"][mainField]} selectionMode="checkbox"
                selectionKeys={toSelectionKeys(options.value)}
                onSelectionChange={handleOnSelectionChange} className="w-full md:w-30rem" />
        </div>
    )
}


// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ITEM DIALOG

export const ItemDialog = (props) => {

    return (
        <FormContextProvider>
            <ItemDataDialog>
                {props.children}
            </ItemDataDialog>
        </FormContextProvider>
    )
}




const ItemDataDialog = ({ children }) => {
    const {
        Item, setItem,
        ItemDialog,
        deleteItemDialog,
        deleteItemsDialog,
        hideDialog,
        Items,
        saveItem,
        hideDeleteItemDialog,
        deleteItem,
        defaultItem,
        hideDeleteItemsDialog,
        deleteSelectedItems,
        // testSave
    } = useFieldDataTableContext();


    const { initCallback, setFieldValues, registerDataModification, registerSubmission, registerMainModification, setDCKey, submit, resetAllRegistries } = useFormContext();

    // const intialize = () => {
    //     setFieldValues(Item);
    // };

    useEffect(() => {
        resetAllRegistries();

        registerSubmission("", (data) => {
            // console.log(data.data);
            // console.log(data.data);
            saveItem(data.data);
        });
        // for the submissions to follow to "Items" values
    }, [Items, Item]);

    useEffect(() => {
        // initCallback.current = intialize;
        // initCallback.current();
        setFieldValues(Item);
    }, [Item]);

    // useEffect(() => {
    //     console.log(Items);
    // }, [Items])
    // const onSubmit = (data) => {
    //     // console.log(data);
    //     saveItem(data);
    // }

    const ItemDialogFooter = (
        <React.Fragment>
            <Button type="button" label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button type="button" label="Save" icon="pi pi-check" onClick={submit} />
        </React.Fragment>
    );
    const deleteItemDialogFooter = (
        <React.Fragment>
            <Button type="button" label="No" icon="pi pi-times" outlined onClick={hideDeleteItemDialog} />
            <Button type="button" label="Yes" icon="pi pi-check" severity="danger" onClick={deleteItem} />
        </React.Fragment>
    );
    const deleteItemsDialogFooter = (
        <React.Fragment>
            <Button type="button" label="No" icon="pi pi-times" outlined onClick={hideDeleteItemsDialog} />
            <Button type="button" label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedItems} />
        </React.Fragment>
    );

    return (
        // 
        <>
            <Dialog visible={ItemDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Item Details" modal className="p-fluid" footer={ItemDialogFooter} onHide={hideDialog}>
                {children}
            </Dialog>

            <Dialog visible={deleteItemDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteItemDialogFooter} onHide={hideDeleteItemDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {Item && (
                        <span>
                            Are you sure you want to delete <b>{Item.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteItemsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteItemsDialogFooter} onHide={hideDeleteItemsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {Item && <span>Are you sure you want to delete the selected Items?</span>}
                </div>
            </Dialog>
        </>
    )


}

export const FieldDataTable = forwardRef(function FieldDataTable(props, ref) {

    // === form
    const formContextValues = useFormContext();
    const { errors, getValues, fieldValues, fieldDynamicConfig, DCKey } = useFormContext();
    const fieldRef = useRef(null);

    const fieldProps = new FieldProperties(props, formContextValues, fieldRef);
    const [defaultConfig] = useState({
        readOnly: props?.readOnly ?? false,
        disabled: props?.disabled ?? false,
        showAddButton: props?.showAddButton ?? false,
        showDeleteButton: props?.showDeleteButton ?? false,
        showActionColumn: props?.showActionColumn ?? false,
        selection: props?.selection ?? false,
        selectionMode: props?.selectionMode ?? "single",
        generateID: props?.generateID ?? true,
        rules: { required: props?.rules?.required ?? props?.required ?? false, },

    });

    const [dynamicConfig, setDynamicConfig] = useState({
    });

    const [config, setConfig] = useState(defaultConfig);

    // ====
    const [Items, setItems] = useState([]);
    const [ItemDialog, setItemDialog] = useState(false);
    const [deleteItemDialog, setDeleteItemDialog] = useState(false);
    const [deleteItemsDialog, setDeleteItemsDialog] = useState(false);

    const [Item, setItem] = useState({});
    const [defaultItem, setDefaultItem] = useState({});

    const [selectedItems, setSelectedItems] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [submittedItem, setSubmittedItem] = useState({ Item: {}, type: "" });

    const [globalFilter, setGlobalFilter] = useState(null);
    const [filters, setFilters] = useState({});


    const toast = useRef(null);
    const dt = useRef(null);


    useEffect(() => {
        fieldProps.registerFieldMod();
    }, []);

    // ===================forms
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

    const completeTableValue = (items) => {

        if (!items) {
            return [];
        }

        // if(props?.generateID === false){
        //     return items;
        // }

        // console.log(items);
        const updatedArray = items.map(item => {

            const id = (item.id) ? item.id : createId();

            return { ...item, id: id };
        });

        // console.log("updatedArray",updatedArray);
        return updatedArray;
    }

    const handleFieldValue = async (fieldValues) => {
        await fieldProps.setFFVal(fieldValues, (value) => {
            return (!value) ? [] : value;
        })
        const _Items = completeTableValue(getValues(fieldProps.getField()));
        handleSetItems(_Items);
    }
    useEffect(() => {
        handleFieldValue(fieldValues);
    }, [fieldValues]);

    const handleSetItems = async (Items) => {
        let _Items = [...Items];
        if (typeof props?.filterOnEachItem === 'function') {
            let index = 0;
            for (const item of _Items) {
                _Items[index] = await props.filterOnEachItem({ ...item });
                index++;
            }
        }

        if (typeof props?.filterItems === 'function') {
            _Items = await props.filterItems([...Items]);
        }
        setItems(_Items);
    }
    // useEffect(() => {

    //     console.log(props?.field, getValues(fieldProps.getField()));

    // }, [getValues(fieldProps.getField())]);

    // useEffect(() => {

    //     console.log(Item);

    // }, [Item]);

    useEffect(() => {

        var finalValue = null;
        if (Items !== null) {

            if (Items.length > 0) {
                finalValue = [...Items];
            }

        };
        fieldProps.setFieldVal(finalValue);


        if (props.hasOwnProperty("onItemsChange")) {
            // console.log(typeof props.onItemsChange === 'function');
            if (typeof props.onItemsChange === 'function') {

                props.onItemsChange([...Items]);
            }
        }

        // console.log(Items);
    }, [Items]);

    useEffect(() => {

        if (props.hasOwnProperty("onNewItem") && submittedItem.type === "new") {
            // console.log(typeof props.onItemsChange === 'function');
            if (typeof props.onNewItem === 'function') {

                props.onNewItem(submittedItem);
            }
        }

        if (props.hasOwnProperty("onUpdateItem") && submittedItem.type === "update") {
            // console.log(typeof props.onItemsChange === 'function');
            if (typeof props.onUpdateItem === 'function') {

                props.onUpdateItem(submittedItem);
            }
        }

        if (props.hasOwnProperty("onDeleteItem") && submittedItem.type === "delete") {
            // console.log(typeof props.onItemsChange === 'function');
            if (typeof props.onDeleteItem === 'function') {

                props.onDeleteItem(submittedItem);
            }
        }



    }, [submittedItem])

    // 
    useImperativeHandle(ref, () => {
        return {
            Items(value) {
                // setItems(value);
                handleSetItems(value);
            },

        };
    }, []);



    const handleOnValueChange = (e) => {
        if (props.hasOwnProperty("onValueChange")) {
            if (typeof props.onValueChange === 'function') {
                props.onValueChange(e);
            }
        }




    }





















    // ============================================================
    // items
    const setVal = (field, value) => {
        let _Item = { ...Item };

        _Item[field] = value;
        setItem(_Item);
    };


    const openNew = () => {
        setItem(defaultItem);
        setSubmitted(false);
        setItemDialog(true);
    };

    const editItem = (Item) => {
        console.log(Item, Items);
        setItem({ ...Item });
        setItemDialog(true);
    };

    // 
    const deleteItem = () => {

        let _Items = Items.filter((val) => val.id !== Item.id);
        setSubmittedItem({ Item: { ...Item }, type: "delete" });
        // setItems(_Items);
        handleSetItems(_Items);

        setDeleteItemDialog(false);
        setItem(defaultItem);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Item Deleted', life: 3000 });

    };


    const hideDialog = () => {
        setSubmitted(false);
        setItemDialog(false);
    };

    const hideDeleteItemDialog = () => {

        setDeleteItemDialog(false);
    };

    const hideDeleteItemsDialog = () => {
        setDeleteItemsDialog(false);
    };




    const saveItem = (data) => {
        // console.log(Items);
        setSubmitted(true);
        // console.log(Items);
        // console.log("Items", Items);
        let _Items = (Items) ? [...Items] : [];
        let _Item = { ...data };
        // console.log(_Item);
        // console.log(Item.id, _Item.id);
        // console.log(Item, _Item);
        if (Item.id) {
            const index = findIndexById(Item.id);
            setSubmittedItem({ Item: _Item, type: "update" });
            _Item.id = Item.id;
            _Items[index] = _Item;
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Item Updated', life: 3000 });
        } else {
            _Item.id = createId();
            // _Item.image = 'Item-placeholder.svg';
            _Items.push(_Item);
            // console.log(_Items);
            setSubmittedItem({ Item: _Item, type: "new" });
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Item Created', life: 3000 });
        }
        // console.log(data, [...Items]);

        // setItems(_Items);
        handleSetItems(_Items);

        setItemDialog(false);
        setItem(defaultItem);

        return _Items;
        // if (Item.name.trim()) {

        // }
    };

    // useEffect(() => { console.log(Items) }, [Items])

    const confirmDeleteItem = (Item) => {
        setItem(Item);
        setDeleteItemDialog(true);
    };


    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < Items.length; i++) {
            if (Items[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 15; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    // header
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteItemsDialog(true);
    };

    const deleteSelectedItems = () => {
        let _Items = Items.filter((val) => !selectedItems.includes(val));

        // setItems(_Items);
        handleSetItems(_Items);

        setDeleteItemsDialog(false);
        setSelectedItems(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Items Deleted', life: 3000 });
    };
    //dialog

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button type="button" label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button type="button" label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedItems || !selectedItems.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button type="button" label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const value =
    {
        // testSave,
        Item,
        setItem,
        Items,
        setItems,
        handleSetItems,
        toast,
        dt,
        setVal,
        confirmDeleteItem,
        editItem,
        selectedItems,
        setSelectedItems,
        // filter
        globalFilter,
        setGlobalFilter,
        // dialog
        fieldProps,
        openNew,
        hideDialog,
        hideDeleteItemDialog,
        hideDeleteItemsDialog,
        saveItem,
        deleteItem,
        deleteSelectedItems,
        confirmDeleteSelected,
        exportCSV,
        ItemDialog, setItemDialog,
        deleteItemDialog, setDeleteItemDialog,
        deleteItemsDialog, setDeleteItemsDialog,
        submitted, setSubmitted,
        submittedItem, setSubmittedItem,
        filters, setFilters,
        defaultItem,
        config, setConfig,
        createId,
        dynamicConfig, setDynamicConfig, handleOnValueChange

    };

    return (
        <FieldDataTableContext.Provider value={value}>
            <Toast ref={toast} position="bottom-center" />


            {props.children}
        </FieldDataTableContext.Provider>
        // <PrimeReactProvider>

        // </PrimeReactProvider>
    );
});

FieldDataTable["ItemDialog"] = ItemDialog;
FieldDataTable["ItemTable"] = ItemTable;

