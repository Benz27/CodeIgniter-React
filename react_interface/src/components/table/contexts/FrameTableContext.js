import React, { createContext, useContext, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useParams } from 'react-router-dom';
import { buildTree } from '../../fn/json/buildTree';
const FrameTableContext = createContext();

export const useFrameTableContext = () => {
    return useContext(FrameTableContext);
}
export function FrameTableContextProvider(props) {
    const [source, setSource] = useState(null);
    // const [filteredSource, setFilteredSource] = useState(null);
    const [cols, setCols] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [globalFilterFields, setGlobalFilterFields] = useState([]);
    const [tableData, setTableData] = useState(null);
    const [tableType, setTableType] = useState(null);
    const [columns, setColumns] = useState({});
    const [config, setConfig] = useState({});
    const colRefs = useRef({});
    const [title, setTitle] = useState("Form");
    const [state, setState] = useState("");
    const [Id, setId] = useState("");
    const [sortMode, setSortMode] = useState(props?.sortMode ?? "single");
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedItemsJSON, setSelectedItemsJSON] = useState({});
    const [metaKey, setMetaKey] = useState(true);


    const FDTCallbacks = useRef();
    const FDTInitCallback = useRef();
    const dt = useRef(null);
    const { FDTId } = useParams();
    let filteredSource = [];

    const validTableTypes = {
        data: true,
        tree: true
    }

    // 
    const [filteredColumns, setFilteredColumns] = useState({
        filtered: findFilteredColumns(props?.filterColumns),
        hidden: findHiddenColumns(props?.hideColumns)
    });

    const filterColumns = (props) => {
        setFilteredColumns({
            filtered: findFilteredColumns(props?.filterColumns),
            hidden: findHiddenColumns(props?.hideColumns)
        });
    }

    const onValueChange = (typeof props?.onValueChange === "function") ? props?.onValueChange : () => { };

    const handleOnValueChange = (e) => {
        filteredSource = e;
        onValueChange(e);
    }


    const exportColumns = () => {
        return cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    const setUpTable = (data, config) => {
        setConfig(config || {});
        setTableData(data);
        // console.log("data", data);
    }

    const initialize = () => {
        if (!tableType || !tableData || !validTableTypes?.[tableType]) {
            // console.log(tableData, tableType, validTableTypes?.[tableType])
            return;
        }
        const source = (tableType === "tree") ? buildTree(tableData?.source || [], config) : tableData?.source || [];
        setFilters(tableData?.["filters"] || []);
        setSource(source);
        setCols(tableData?.["cols"] || []);
        setGlobalFilterFields(tableData?.["globalFilterFields"] || []);
        setGlobalFilterValue('');

    }

    const clearFilter = () => {
        setGlobalFilterValue('');

    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    // ===================exports

    const exportCSV = ({ selectionOnly }) => {
        dt.current.exportCSV(selectionOnly);
    };

    const exportPdf = ({ fileName }) => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns(), filteredSource);
                doc.save(`${fileName}.pdf`);
            });
        });
    };

    const exportExcel = ({ fileName }) => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(filteredSource);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, fileName);
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    const exportTable = ({ type, filename, selectionOnly }) => {

        filename = filename || "table-export";

        if (type === "excel") {
            exportExcel({ fileName: filename });
            return;
        }

        if (type === "PDF") {
            exportPdf({ fileName: filename });
            return;
        }


        exportCSV({ selectionOnly: selectionOnly || false });





    }





    const value = {
        source, setSource,
        filters, setFilters,
        loading, setLoading,
        columns, setColumns,
        title, setTitle,
        state, setState,
        globalFilterValue, setGlobalFilterValue,
        globalFilterFields, setGlobalFilterFields,
        initialize, onGlobalFilterChange, clearFilter, FDTCallbacks, FDTInitCallback, FDTId, dt,
        exportExcel, exportPdf, exportCSV, exportTable,
        handleOnValueChange, colRefs,
        filteredColumns, setFilteredColumns,
        defineHidden, filterColumns,
        tableType, setTableType, setTableData, tableData, setUpTable,
        config, setConfig, sortMode, setSortMode,
        selectedItems, setSelectedItems, selectedItemsJSON, setSelectedItemsJSON
    };

    return (
        <FrameTableContext.Provider value={value}>
            {props.children}
        </FrameTableContext.Provider>
    );
}

const findFilteredColumns = (props) => {

    const filteredColumns = {};
    const filteredColumnsArr = (Array.isArray(props)) ? props : [];
    for (const col of filteredColumnsArr) {
        filteredColumns[col] = true;
    }

    return filteredColumns
}

const findHiddenColumns = (props) => {

    const hiddeColumns = {};
    const hiddenColumnsArr = (Array.isArray(props)) ? props : [];
    for (const col of hiddenColumnsArr) {
        hiddeColumns[col] = true;
    }
    return hiddeColumns;
}

export const defineHidden = (hiddenColumns, field) => {
    const { hidden, filtered } = hiddenColumns;

    const isEmpty = Object.keys(filtered).length === 0;

    let hide = false;

    if (!filtered?.[field] && !isEmpty) {
        hide = true;
    }
    if (hidden?.[field]) {
        hide = true;
    }



    return hide;
}
