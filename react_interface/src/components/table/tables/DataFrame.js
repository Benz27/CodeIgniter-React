import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { useFrameTableContext } from '../contexts/FrameTableContext';
import { ContextMenu } from 'primereact/contextmenu';
export default function DataFrame({ sortField,
    onContextMenu: _onContextMenu = () => { },
    sortOrder, selectionMode: _selectionMode = false, sortMode: _sortMode = "single", isSelectable: _isSelectable = () => { return true },
    rowClassName: _rowClassName, ...props }) {
    const { source, setSource,
        filters, setFilters,
        loading, setLoading,
        globalFilterValue, setGlobalFilterValue,
        globalFilterFields, dt, onGlobalFilterChange, clearFilter, handleOnValueChange, tableData, setTableType, tableType, initialize,
        selectedItems, setSelectedItems, selectedItemsJSON, setSelectedItemsJSON } = useFrameTableContext();

    const onContextMenu = (typeof _onContextMenu === "function") ? _onContextMenu : () => { };

    const rowClassName = (typeof _rowClassName !== "string" && typeof _rowClassName !== "function") ? () => { } : "";


    useEffect(() => {
        setTableType("data");
    }, [])
    useEffect(() => {
        initialize();
    }, [tableData, tableType]);


    useEffect(() => {
        setSelectedItemsJSON(() => {
            const itemsJSON = {};
            for (const item of selectedItems) {
                itemsJSON[item.id] = item;
            }
            return itemsJSON;
        });
    }, [selectedItems]);


    const isSelectable = (typeof _isSelectable === "function") ? _isSelectable : () => { return true };
    const isRowSelectable = (event) => (event.data ? isSelectable(event.data) : true);

    return (
        <div className="card" onContextMenu={onContextMenu}>
            <DataTable ref={dt} value={source} paginator showGridlines rows={10} loading={loading} dataKey="id"
                filters={filters}
                sortMode={_sortMode}
                sortField={sortField ?? null}
                selection={selectedItems}
                // onFilter={(e)=>{console.log(e)}}
                // contextMenuSelection={selectedContextItem}
                // onContextMenuSelectionChange={(e) => selectByContext(e)}
                // onSort={(event)=>{return event}}
                // onFilter={(event)=>console.log(event)}

                isDataSelectable={isRowSelectable}
                rowClassName={(typeof _rowClassName !== "string" && typeof _rowClassName !== "function") ? (rowdData) => {
                    let _className = "";
                    _className += (selectedItemsJSON?.[rowdData?.id]) ? "bg-selected" : "";
                    return _className;
                } : _rowClassName}
                onSelectionChange={(e) => {
                    console.log(e);
                    setSelectedItems(e.value)
                }}
                metaKeySelection={true}
                selectionMode={_selectionMode}

                sortOrder={sortOrder ?? 1}
                rowsPerPageOptions={[5, 10, 25, 50, 75, 100]}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                globalFilterFields={globalFilterFields} onValueChange={handleOnValueChange}
                emptyMessage="Empty.">
                {props.children}
            </DataTable>
        </div>
    );
};
