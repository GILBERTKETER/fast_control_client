import { useContext, useEffect } from 'react';
import { ApplicationsCtx } from '../context';
import { getAllGraphs } from '../data/db';

export function useApplicationsCtx() {
    const { applicationsCtx, setApplicationsCtx } = useContext(ApplicationsCtx);

    function resetConfig() {
        setApplicationsCtx(prev => ({
            ...prev,
            connectionConfig: {
                hostname: 'localhost',
                username: 'root',
                password: '',
                database: 'graph_database',
                database_id: null,
            },
        }));

        return;
    }

    function updateAppName(name) {
        setApplicationsCtx(prev => ({ ...prev, name: name }));
    }

    function getAppName() {
        return applicationsCtx?.name ?? '';
    }

    async function populateDatabaseID(altName) {
        // find the database id of the given database
        const allGraphs = await getAllGraphs();

        const graphId =
            allGraphs.find(
                graph =>
                    graph?.name == (altName ? altName : applicationsCtx?.connectionConfig?.database)
            )?.id ?? null;

        setApplicationsCtx(prev => ({
            ...prev,
            connectionConfig: {
                ...prev.connectionConfig,
                database: altName ?? prev.connectionConfig.database,
                database_id: graphId,
            },
        }));
    }

    function updateConnectionConfig(newConnectionConfig) {
        if (newConnectionConfig) {
            setApplicationsCtx(prev => ({
                ...prev,
                connectionConfig: newConnectionConfig,
            }));
        }
    }

    useEffect(() => {
        if (applicationsCtx.connectionConfig?.database) {
            populateDatabaseID();
        }
    }, [applicationsCtx.connectionConfig?.database]);
    return {
        applicationsCtx,
        resetConfig,
        populateDatabaseID,
        updateConnectionConfig,
        getAppName,
        updateAppName,
    };
}
