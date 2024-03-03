import React, { createContext } from 'react';

const formBuilderCtxDefaults = {
    selectedTable: {},
    linkDict: null,
};

export const FormBuilderCtx = createContext(null);
