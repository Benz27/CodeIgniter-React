import { useEffect, useRef, useState } from "react"
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Tree } from "primereact/tree";
import { Tag } from "primereact/tag";
import { Dropdown } from 'primereact/dropdown';
import { getPathValue } from "../../fn/json/getPathValue";
import { useFrameTableContext } from "../contexts/FrameTableContext";
import { format } from "date-fns";
import { Chips } from "primereact/chips";


export const filterClearTemplate = (options) => {
    return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} severity="secondary"></Button>;
};

export const filterApplyTemplate = (options) => {
    return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} severity="success"></Button>;
};

export const filterFooterTemplate = () => {
    return <div className="px-3 pt-0 pb-3 text-center">Filter</div>;
};

export const MultiSelectFilterTemplate = ({ options, data, optionLabel, path, placeholder }) => {
    // console.log(options.value)

    const [value, setValue] = useState();

    const handleOnChange = (e) => {
        const filter_value = e.value?.map((val) => val["name"])
        console.log(filter_value);

        options.filterCallback(e.value);

    }

    return <MultiSelect value={options.value} options={data} itemTemplate={(option) => { return MultiSelectItemTemplate({ option, path }) }}
        onChange={handleOnChange} optionLabel={optionLabel ?? "name"} placeholder={placeholder ?? "Any"} className="p-column-filter" />;
};

export const ChipsFilterTemplate = ({ options, placeholder }) => {

    return <Chips value={options.value} 
        onChange={(e) => options.filterCallback(e.value)} placeholder={placeholder ?? "Any"} className="p-column-filter" />;
};










const MultiSelectItemTemplate = ({ option, path }) => {
    return (
        <div className="flex align-items-center gap-2">
            <span>{getPathValue(option, path)}</span>
        </div>
    );
};

export const GlobalFilterField = () => {

    const { onGlobalFilterChange, globalFilterValue, clearFilter } = useFrameTableContext()

    return (
        <div className="flex justify-content-between">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </span>
        </div>
    );
};

// ======
export const dateBodyTemplate = (rowData, path) => {
    return format(getPathValue(rowData, path), "EEEE, MMMM d, yyyy h:mm a");
};


export const dateFilterTemplate = (options) => {
    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy hh:mm:ss" placeholder="mm/dd/yyyy" mask="99/99/9999 99:99:99" />;
};


export const TreeSelectFilterTemplate = (options, treeNodes, treeVals) => {


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

            if (treeVals.hasOwnProperty(key)) {
                data.push({ label: treeVals[key].label, data: key });
            }
            data.push({ label: null, data: key });

        };

        return data;
    };

    return (
        <div className="card flex justify-content-center">
            <Tree value={treeNodes} selectionMode="checkbox"
                selectionKeys={toSelectionKeys(options.value)}
                onSelectionChange={handleOnSelectionChange}
                className="w-full md:w-30rem" />
        </div>
    )
}


export const statusBodyTemplate = (rowData, getSeverity) => {
    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
};

export const statusFilterTemplate = (options, statuses) => {
    return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
};

export const statusItemTemplate = (option, getSeverity) => {
    return <Tag value={option} severity={getSeverity(option)} />;
};

// ================================================

export const TableMenuBar = ({ model, label }) => {

    const menuLeft = useRef(null);

    return (<div className="card flex justify-content-center">

        <Menu model={setMenuItems(model)} popup ref={menuLeft} id="popup_menu_left" />
        <Button type='button' label={label} icon="pi pi-align-left" className="mr-2" onClick={(event) => menuLeft.current.toggle(event)} aria-controls="popup_menu_left" aria-haspopup />

    </div>)
}


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

        const template = {
            template: null
        };
        const command = (typeof element?.command === "function") ? element?.command : (e) => { };
        const label = (element?.label) ? element?.label : "";

        const handleOnclick = () => {
            command(element);
        }

        template.template = (item, options) => {
            return (
                <a role='button'
                    className="nav-link"
                    onClick={handleOnclick}

                >
                    <div className='text-dark'>{label}</div>
                </a>
            );
        }
        nItems.push(template);


    })

    return nItems;
}


// 
export const GlobalSearch = () => {

    const { globalFilterValue, onGlobalFilterChange, clearFilter } = useFrameTableContext();

    return (
        <div className="flex justify-content-between">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </span>
        </div>
    );
};

// 

export const ExportTable = (props) => {

    const { exportCSV, exportExcel, exportPdf } = useFrameTableContext();
    const fileName = props?.fileName || "table_export";
    const selectionOnly = props?.selectionOnly ?? false;
    const label = "Export Table";
    const items = [
        {
            items: [
                {
                    label: 'Export as CSV file',
                    icon: 'pi pi-refresh',
                    type: "PRF",
                    command: () => exportCSV({ selectionOnly: selectionOnly })
                },
                {
                    label: 'Export as PDF file',
                    icon: 'pi pi-refresh',
                    type: "RFS",
                    command: () => { exportPdf({ fileName: fileName }) }

                },
                {
                    label: 'Export as Excel file',
                    icon: 'pi pi-refresh',
                    type: "PSV",
                    command: () => { exportExcel({ fileName: fileName }) }

                },
            ]
        }

    ]

    return (
        <TableMenuBar model={items} label={label} />
    )
}