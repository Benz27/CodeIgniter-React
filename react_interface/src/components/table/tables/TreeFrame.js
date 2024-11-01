import React, { useState, useEffect } from 'react';
import { TreeTable } from 'primereact/treetable';
import { useFrameTableContext } from '../contexts/FrameTableContext';
export default function TreeFrame(props) {

    const { source, setSource,
        filters, setFilters,
        loading, setLoading,
        globalFilterValue, setGlobalFilterValue,
        globalFilterFields, dt, onGlobalFilterChange, config, handleOnValueChange, tableData, setTableType, tableType, initialize } = useFrameTableContext();

    useEffect(() => {
        setTableType("tree");
    }, [])

    useEffect(() => {
        initialize();
        // console.log(config);
    }, [tableData, tableType, config]);


    return (
        <div className="card">
            <TreeTable
                ref={dt}
                value={source} 
                paginator 
                showGridlines 
                rows={10} loading={loading}
                // filterMode='lenient'
                rowsPerPageOptions={[5, 10, 25, 50, 75, 100]}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                filters={filters}
                emptyMessage='Empty.'
                globalFilterFields={globalFilterFields} 
                onValueChange={handleOnValueChange}
                tableStyle={{ minWidth: '50rem' }}
                resizableColumns
                scrollable
            >
                {props.children}
            </TreeTable>
        </div>
    );
};
