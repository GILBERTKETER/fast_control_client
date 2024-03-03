import { FormBuilderCtx } from '../context';
import { useState } from 'react';

export const FormBuilderCtxProvider = ({ children }) => {
    const [formBuilderCtx, setFormBuilderCtx] = useState({
        formName: 'Untitled Form',
        selectedTable: {
            fields: [],
        },
        availableTables: [],
        linkDict: null,
        initialSavedForm: null,
        isLoading: {
            status: false,
        },
        optionsConfig: {
            elmId: {
                labelField: null,
                valueField: null,
                availableOptions: [],
            },
        },
        customFieldInputs: {
            ['field_id']: {
                element: 'dropdown' || 'multichoice',
            },
        },
    });
    return (
        <FormBuilderCtx.Provider value={{ formBuilderCtx, setFormBuilderCtx }}>
            {children}
        </FormBuilderCtx.Provider>
    );
};
