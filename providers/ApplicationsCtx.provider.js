import { useState } from 'react';
import { ApplicationsCtx } from '../context';

export const ApplicationsCtxProvider = ({ children }) => {
    const [applicationsCtx, setApplicationsCtx] = useState({
        connectionConfig: {
            hostname: 'localhost',
            username: 'root',
            password: '',
            database: 'graph_database',
            database_id: null,
        },
        name: '_',
    });
    return (
        <ApplicationsCtx.Provider value={{ applicationsCtx, setApplicationsCtx }}>
            {children}
        </ApplicationsCtx.Provider>
    );
};
