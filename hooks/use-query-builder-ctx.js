import { useContext } from 'react';
import { FormBuilderCtx, QueryBuilderCtx } from '../context';
import { getUniqueListBy } from '../utils/helpers';

export function useQueryBuilderCtx() {
    const { queryBuilderCtx, setQueryBuilderCtx } = useContext(QueryBuilderCtx);

    function getFields() {
        return queryBuilderCtx?.selectedTable?.fields ?? [];
    }

    function getAvailableTables() {
        return queryBuilderCtx?.availableTables ?? [];
    }

    function getSelectedTable() {
        return queryBuilderCtx?.selectedTable ?? {};
    }

    function getSelectedTables() {
        return queryBuilderCtx?.selectedTables ?? [];
    }

    function getParsedSelectedTables() {
        return (
            getSelectedTables()?.map(s_table => ({
                ...s_table,
                fields:
                    s_table?.fields?.map(s_table_field => ({
                        name: s_table_field?.name,
                        label: s_table_field?.name,
                        placeholder: s_table_field?.name,
                    })) ?? [],
            })) ?? []
        );
    }

    // function existsInSelectedTables() {}

    function getTable(tableId) {
        return queryBuilderCtx?.availableTables?.find(table => table.id === tableId) ?? null;
    }

    function setQueryName(name) {
        setQueryBuilderCtx(prev => ({ ...prev, queryName: name }));
    }

    function getQueryName() {
        return queryBuilderCtx?.queryName ?? '';
    }

    function populateInitialSavedQuery(task_data = null) {
        if (task_data) {
            setQueryBuilderCtx(prev => ({
                ...prev,
                initialSavedQueryFields: task_data,
            }));
        }
    }

    function toggleQueryBuilderLoading(override) {
        if (override) {
            setQueryBuilderCtx(prev => ({
                ...prev,
                isLoading: { ...prev.isLoading, status: override ?? false },
            }));
            return;
        }
        if (queryBuilderCtx?.isLoading.status === true) {
            setQueryBuilderCtx(prev => ({
                ...prev,
                isLoading: { ...prev.isLoading, status: false },
            }));
            return;
        } else {
            setQueryBuilderCtx(prev => ({
                ...prev,
                isLoading: { ...prev.isLoading, status: true },
            }));
            return;
        }
    }

    function populateQueryFields(fields, append) {
        if (append) {
            setQueryBuilderCtx(prev => ({
                ...prev,
                selectedTable: {
                    ...prev.selectedTable,
                    fields: [...prev.selectedTable.fields, ...fields],
                },
            }));
            return getFields();
        } else {
            setQueryBuilderCtx(prev => ({
                ...prev,
                selectedTable: {
                    ...prev.selectedTable,
                    fields: fields,
                },
            }));
            return getFields();
        }
    }

    function populateSelectedTable(table) {
        if (table) {
            setQueryBuilderCtx(prev => ({ ...prev, selectedTable: table }));
        }

        return queryBuilderCtx?.selectedTable ?? {};
    }

    function populateSelectedTables(tableIds) {
        if (tableIds) {
            setQueryBuilderCtx(prev => ({
                ...prev,
                selectedTables: getUniqueListBy(
                    getAvailableTables().filter(availableTable =>
                        tableIds.includes(availableTable.id)
                    ),
                    'id'
                ),
            }));
        }

        return queryBuilderCtx?.selectedTables ?? [];
    }

    function removeSelectedTable(tableId) {
        if (tableId) {
            setQueryBuilderCtx(prev => ({
                ...prev,
                selectedTables: getUniqueListBy(
                    getSelectedTables().filter(availableTable => tableId !== availableTable.id),
                    'id'
                ),
            }));
        }
    }

    function addField(field) {
        if (field) {
            setQueryBuilderCtx(prev => ({
                ...prev,
                selectedTable: {
                    ...prev.selectedTable,
                    fields: [...prev.selectedTable.fields, field],
                },
            }));
        }
    }

    function populateTables(availableTables, append) {
        if (availableTables?.length > 0) {
            setQueryBuilderCtx(prev => ({
                ...prev,
                availableTables: append
                    ? [...prev.availableTables, ...availableTables]
                    : availableTables,
            }));
        }
        return getAvailableTables();
    }

    function updateQueryString(query_string) {
        if (query_string) {
            setQueryBuilderCtx(prev => ({
                ...prev,
                queryString: query_string,
            }));
        }
    }
    return {
        queryBuilderCtx,
        getFields,
        getAvailableTables,
        getSelectedTable,
        setQueryName,
        getQueryName,
        populateInitialSavedQuery,
        populateQueryFields,
        toggleQueryBuilderLoading,
        populateSelectedTable,
        addField,
        populateTables,
        // multiselected tables
        getSelectedTables,
        populateSelectedTables,
        getTable,
        removeSelectedTable,
        getParsedSelectedTables,
        updateQueryString,
    };
}
