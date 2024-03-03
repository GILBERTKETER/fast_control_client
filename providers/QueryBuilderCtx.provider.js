import { useState } from 'react';
import { QueryBuilderCtx } from '../context';

export const QueryBuilderCtxProvider = ({ children }) => {
    const [queryBuilderCtx, setQueryBuilderCtx] = useState({
        queryName: 'Untitled Query',
        selectedTable: {
            fields: [],
        },
        selectedTables: [],
        availableTables: [],
        linkDict: null,
        initialSavedQueryFields: null,
        queryString: '',
    });

    return (
        <QueryBuilderCtx.Provider value={{ queryBuilderCtx, setQueryBuilderCtx }}>
            {children}
        </QueryBuilderCtx.Provider>
    );
};
