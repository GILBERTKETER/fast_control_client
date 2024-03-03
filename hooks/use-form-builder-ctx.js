import { useContext } from 'react';
import { FormBuilderCtx } from '../context';

export function useFormBuilderCtx() {
    const { formBuilderCtx, setFormBuilderCtx } = useContext(FormBuilderCtx);

    function getFields() {
        return formBuilderCtx?.selectedTable?.fields ?? [];
    }

    function getAvailableTables() {
        return formBuilderCtx?.availableTables ?? [];
    }

    function getSelectedTable() {
        return formBuilderCtx?.selectedTable ?? {};
    }

    function setFormName(name) {
        setFormBuilderCtx(prev => ({ ...prev, formName: name }));
    }

    function getFormName() {
        return formBuilderCtx?.formName ?? '';
    }

    function populateInitialSavedForm(form = null) {
        if (form) {
            setFormBuilderCtx(prev => ({
                ...prev,
                initialSavedForm: form,
            }));
        }
    }

    function toggleFormBuilderLoading(override) {
        if (override) {
            setFormBuilderCtx(prev => ({
                ...prev,
                isLoading: { ...prev.isLoading, status: override ?? false },
            }));
            return;
        }
        if (formBuilderCtx?.isLoading.status === true) {
            setFormBuilderCtx(prev => ({
                ...prev,
                isLoading: { ...prev.isLoading, status: false },
            }));
            return;
        } else {
            setFormBuilderCtx(prev => ({
                ...prev,
                isLoading: { ...prev.isLoading, status: true },
            }));
            return;
        }
    }

    function populateFields(fields, append) {
        if (append) {
            setFormBuilderCtx(prev => ({
                ...prev,
                selectedTable: {
                    ...prev.selectedTable,
                    fields: [...prev.selectedTable.fields, ...fields],
                },
            }));
            return getFields();
        } else {
            setFormBuilderCtx(prev => ({
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
            setFormBuilderCtx(prev => ({ ...prev, selectedTable: table }));
        }

        return formBuilderCtx?.selectedTable ?? {};
    }

    function addField(field) {
        if (field) {
            setFormBuilderCtx(prev => ({
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
            setFormBuilderCtx(prev => ({
                ...prev,
                availableTables: append
                    ? [...prev.availableTables, ...availableTables]
                    : availableTables,
            }));
        }
        return getAvailableTables();
    }

    /**
     *
     * @param {string} fieldID
     * @param {string} elementID
     * @param {boolean} byRelation
     */
    function markFieldAsLinked(fieldID, elementID, byRelation) {
        if (fieldID) {
            setFormBuilderCtx(prev => ({
                ...prev,
                selectedTable: {
                    ...prev.selectedTable,
                    fields: prev.selectedTable.fields.map(field => {
                        if (field?.isLinked?.elementID == elementID) {
                            // console.log(`Field ${fieldID} already linked to ${elementID}`);
                            unmarkLinkedField(field.id);
                        }
                        if (field.id === fieldID) {
                            field['isLinked'] = { status: true, elementID, byRelation };
                        }
                        return field;
                    }),
                },
            }));
        }
    }

    function unmarkLinkedField(fieldID) {
        if (fieldID) {
            setFormBuilderCtx(prev => ({
                ...prev,
                selectedTable: {
                    ...prev.selectedTable,
                    fields: prev.selectedTable.fields.map(field => {
                        if (field.id === fieldID) {
                            field['isLinked'] = { status: false, elementID: '' };
                        }
                        return field;
                    }),
                },
            }));
        }
    }

    function unlinkElement(elementID) {
        if (elementID) {
            setFormBuilderCtx(prev => ({
                ...prev,
                selectedTable: {
                    ...prev.selectedTable,
                    fields: prev.selectedTable.fields.map(field => {
                        if (field?.isLinked?.elementID == elementID) {
                            field['isLinked'] = { status: false, elementID: '' };
                        }
                        return field;
                    }),
                },
            }));
        }
    }

    function populateLinkDict(linkDict) {
        if (linkDict) {
            setFormBuilderCtx(prev => ({
                ...prev,
                linkDict,
            }));
        }
    }

    function getTableById(id) {
        return formBuilderCtx?.availableTables?.find(tb => tb.id == id) ?? null;
    }

    function changeOptionsConfig(fieldId, targetOptionsConfig) {
        if (targetOptionsConfig) {
            setFormBuilderCtx(prev => ({
                ...prev,
                optionsConfig: {
                    ...prev.optionsConfig,
                    [fieldId]: { ...prev.optionsConfig[fieldId], ...targetOptionsConfig },
                },
            }));
        }
    }

    function loadInitialOptionsConfig(targetOptionsConfig) {
        if (targetOptionsConfig) {
            setFormBuilderCtx(prev => ({
                ...prev,
                optionsConfig: { ...targetOptionsConfig },
            }));
        }
    }

    function changeCustomFieldInput(fieldID, data) {
        if (fieldID) {
            setFormBuilderCtx(prev => ({
                ...prev,
                customFieldInputs: {
                    ...prev.customFieldInputs,
                    [fieldID]: { ...prev.customFieldInputs[fieldID], ...data },
                },
            }));
            return;
        }
    }
    return {
        formBuilderCtx,
        getFields,
        getAvailableTables,
        populateFields,
        addField,
        populateTables,
        populateSelectedTable,
        markFieldAsLinked,
        unmarkLinkedField,
        getSelectedTable,
        setFormName,
        getFormName,
        populateLinkDict,
        populateInitialSavedForm,
        toggleFormBuilderLoading,
        getTableById,
        unlinkElement,
        changeOptionsConfig,
        loadInitialOptionsConfig,
        changeCustomFieldInput,
    };
}

/**
 * if the relation is 1 to *, then show a dropdown of *
 * if the relation is 1 to 1, the show radio buttons for selection or dropdown still
 * relation is * to 1, show dropdown for 1
 */
