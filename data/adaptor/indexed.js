/* Creating a database called graphDB and creating a table called graphs. */
import Dexie from 'dexie';
import { Notification } from '@arco-design/web-react';
import { diffJson } from 'diff';
import { nanoid } from 'nanoid';
import { SERVER_URL } from '../../config';
import { uuid } from '../../components/formbuilder/UUID';

export const db = new Dexie('graphDB');

db.version(4).stores({
    graphs: 'id',
    logs: '++id, graphId',
});

// export const getAllGraphs = async () => await db.graphs.toArray();
export const getAllGraphs = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/getAllGraphs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        const graphs = [];
        data.allGraphsData.forEach(item => {
            graphs.push({ ...JSON.parse(item?.graph).graphJSON, id: item.id });
        });

        return graphs;
    } catch (e) {
        console.log(e);
        Notification.error({
            title: 'Server Connection Error',
        });
    }
};

//export const getGraph = async id => await db.graphs.get(id);
export const getGraph = async id => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/getGraph`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }), // Replace with your desired data to send
        });

        const data = await response.json();
        const graph = JSON.parse(data?.graphData?.graph).graphJSON;

        return graph;
    } catch (e) {
        console.log(e);
        Notification.error({
            title: 'Server Connection Error',
        });
        return null;
    }
};

export const saveGraph = async ({ id, name, tableDict, linkDict, box, connectConfig }) => {
    const now = new Date().valueOf();
    try {
        const data = await getGraph(id);
        let graphJSON = {
            tableDict,
            linkDict,
            box,
            name,
            connectConfig,
            updatedAt: now,
            createdAt: data.createdAt,
        };
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/saveGraph`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id, graphJSON: graphJSON }), // Replace with your desired data to send
        });
        Notification.success({
            title: 'Save success',
        });
    } catch (e) {
        Notification.error({
            title: 'Save failed',
        });
    }
};

// export const delGraph = async id => await db.graphs.delete(id);
export const delGraph = async id => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/deleteGraph`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }), // Replace with your desired data to send
        });
        Notification.success({
            title: 'Delete success',
        });
    } catch (e) {
        Notification.error({
            title: 'Delete failed',
        });
    }
};

export const deleteAllGraphs = async id => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/deleteAllGraphs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        Notification.success({
            title: 'Delete success',
        });
    } catch (e) {
        Notification.error({
            title: 'Delete failed',
        });
    }
};

export const addGraph = async (graph = {}, id = null) => {
    const now = new Date().valueOf();
    let graphId;
    try {
        let graphJSON = {
            ...graph,
            box: {
                x: 0,
                y: 0,
                w: global.innerWidth,
                h: global.innerHeight,
                clientW: global.innerWidth,
                clientH: global.innerHeight,
            },
            connectConfig: {
                hostname: 'localhost',
                username: 'root',
                password: '',
                database: 'graph_database',
            },
            createdAt: now,
            updatedAt: now,
        };
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/addGraph`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ graphJSON }), // Replace with your desired data to send
        });

        const data = await response.json();
        graphId = data?.graphID;
        Notification.success({
            title: 'Add Success',
        });
    } catch (e) {
        Notification.error({
            title: 'Add Failed',
        });
    }

    return graphId;
};

export const getLogs = async id => await db.logs.where('graphId').equals(id).desc().toArray();

export const delLogs = id => db.logs.delete(id);

// Application
export const getAllApplications = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/getAllApplications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        const apps =
            data.allApplications?.map(_app => ({
                ...(JSON.parse(_app?.application).appJSON ?? {}),
                id: _app?.id ?? '_',
            })) ?? [];

        return apps;
    } catch (e) {
        console.log(e);
        Notification.error({
            title: 'Server Connection Error',
        });
    }
};

export const getApplication = async id => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/getApplication`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }), // Replace with your desired data to send
        });

        const data = await response.json();

        const app = {
            ...JSON.parse(data?.applicationData?.application).appJSON,
            id: data?.applicationData?.id ?? '_',
        };

        return app;
    } catch (e) {
        console.log(e);
        Notification.error({
            title: 'Server Connection Error',
        });
    }
};

export const saveApplication = async (utilData = {}, appId = null) => {
    const now = new Date().valueOf();
    try {
        const data = await getApplication(appId);
        let appJSON = {
            ...data,
            updatedAt: now,
            createdAt: data.createdAt,
            ...utilData,
        };
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/saveApplication`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: appId, appJSON: appJSON }), // Replace with your desired data to send
        });
        Notification.success({
            title: 'Save success',
        });
    } catch (e) {
        Notification.error({
            title: 'Save failed',
        });
    }
};

// export const delApplication = async id => await db.graphs.delete(id);
export const delApplication = async id => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/deleteApplication`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }), // Replace with your desired data to send
        });
        Notification.success({
            title: 'Delete success',
        });
    } catch (e) {
        Notification.error({
            title: 'Delete failed',
        });
    }
};

export const deleteAllApplications = async id => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/deleteAllApplications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        Notification.success({
            title: 'Delete success',
        });
    } catch (e) {
        Notification.error({
            title: 'Delete failed',
        });
    }
};

export const addApplication = async (utilData = {}, id = null) => {
    const now = new Date().valueOf();
    let appId;
    /**
     * for a new application
     * JSON format
     * interface Form {
     * formId: string;
     * appId: string;
     * tables: TableIds[]
     * task_data: FormBuilder
     * }
     * {
     * appId: string;
     * appName: string;
     * database: => point graph object || graphID
     * forms: FormIds[]
     * queries: QueryIds[]
     * }
     */
    try {
        let appJSON = {
            connectionConfig: {
                hostname: 'localhost',
                username: 'root',
                password: '',
                database: '',
                database_id: null,
            },
            forms: [],
            queries: [],
            createdAt: now,
            updatedAt: now,
            ...utilData,
        };
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/addApplication`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appJSON: appJSON }), // Replace with your desired data to send
        });

        const data = await response.json();
        appId = data?.appId;
        Notification.success({
            title: 'Add Success',
        });
    } catch (e) {
        Notification.error({
            title: 'Add Failed',
        });
    }

    return appId;
};

// Form
export const getAllForms = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/getAllForms`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        return (
            data.allForms?.map(_form => ({
                ...(JSON.parse(_form.form)?.formJSON ?? {}),
                id: _form.id,
            })) ?? []
        );
    } catch (e) {
        console.log(e);
        Notification.error({
            title: 'Server Connection Error',
        });
        return [];
    }
};

export const getForm = async id => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/getForm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }), // Replace with your desired data to send
        });

        const data = await response.json();

        const { formJSON: form } = JSON.parse(data?.formData?.form);

        return { ...form, id: data?.formData?.id ?? '_' };
    } catch (e) {
        console.log(e);
        Notification.error({
            title: 'Server Connection Error',
        });
        return;
    }
};

export const getFormsByApplication = async appId => {
    try {
        if (!appId) {
            return [];
        }
        const allForms = await getAllForms();

        return (
            allForms
                ?.filter(_form => _form?.appId === appId)
                ?.map(_target_form => ({
                    ...(_target_form ?? {}),
                    id: _target_form?.id ?? '_',
                })) ?? []
        );
    } catch (err) {
        console.log(err);
        Notification.error({
            title: 'Server Connection Error',
        });
        return [];
    }
};

export const saveForm = async (formId, utilData = {}) => {
    const now = new Date().valueOf();
    try {
        const data = await getForm(formId);

        let formJSON = {
            ...data,
            updatedAt: now,
            createdAt: data.createdAt,
            ...utilData,
        };

        // {"formJSON":{"appId":"14","tables":[],"task_data":[],"createdAt":1701800029650,"updatedAt":1701800029650,"name":"Untitled form 0"}}
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/saveForm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: formId, formJSON: formJSON }), // Replace with your desired data to send
        });
        Notification.success({
            title: 'Save success',
        });
    } catch (e) {
        console.log(e);
        Notification.error({
            title: 'Save failed',
        });
    }
};

export const delForm = async id => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/deleteForm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }), // Replace with your desired data to send
        });
        Notification.success({
            title: 'Delete success',
        });
    } catch (e) {
        Notification.error({
            title: 'Delete failed',
        });
    }
};

export const deleteAllForms = async id => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/deleteAllForms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        Notification.success({
            title: 'Delete success',
        });
    } catch (e) {
        Notification.error({
            title: 'Delete failed',
        });
    }
};

export const addForm = async (utilData = {}, appId = null) => {
    const now = new Date().valueOf();
    let formId;
    try {
        /**
         * interface Form {
         * formId: string;
         * appId: string;
         * tables: TableIds[]
         * task_data: FormBuilder
         * }
         */
        let formJSON = {
            appId,
            table: null,
            task_data: [],
            createdAt: now,
            updatedAt: now,
            ...utilData,
        };
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/addForm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ formJSON }), // Replace with your desired data to send
        });

        const data = await response.json();
        formId = data?.formId;
        Notification.success({
            title: 'Add Success',
        });
    } catch (e) {
        Notification.error({
            title: 'Add Failed',
        });
    }

    return formId;
};
/*-------Form End--------//*/
// Query
export const getAllQueries = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/getAllQueries`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        const graphs = [];
        // data.allQuerysData.forEach(item => {
        //     graphs.push({ ...JSON.parse(item?.graph).graphJSON, id: item.id });
        // });

        return data?.allQueries?.map(_query => ({
            ...(JSON.parse(_query.query)?.queryJSON ?? {}),
            id: _query?.id ?? '_',
        }));
    } catch (e) {
        console.log(e);
        Notification.error({
            title: 'Server Connection Error',
        });
    }
};

export const getQuery = async id => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/getQuery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }), // Replace with your desired data to send
        });

        const data = await response.json();

        const query = JSON.parse(data?.queryData?.query).queryJSON;

        return { ...query, id: data?.queryData?.id ?? '_' };
    } catch (e) {
        console.log(e);
        Notification.error({
            title: 'Server Connection Error',
        });
    }
};

export const getAllQueriesByApplication = async appId => {
    try {
        if (!appId) {
            return [];
        }
        const allQueries = await getAllQueries();

        return (
            allQueries
                ?.filter(_query => _query?.appId === appId)
                ?.map(_target_query => ({
                    ...(_target_query ?? {}),
                    id: _target_query?.id ?? '_',
                })) ?? []
        );
    } catch (err) {
        console.log(err);
        Notification.error({
            title: 'Server Connection Error',
        });
        return [];
    }
};

export const saveQuery = async (queryId, utilData = {}) => {
    const now = new Date().valueOf();
    try {
        const data = await getQuery(queryId);
        let queryJSON = {
            ...data,
            updatedAt: now,
            createdAt: data.createdAt,
            ...utilData,
        };
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/saveQuery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: queryId, queryJSON: queryJSON }), // Replace with your desired data to send
        });
        Notification.success({
            title: 'Save success',
        });
    } catch (e) {
        console.log(e);
        Notification.error({
            title: 'Save failed',
        });
    }
};

export const delQuery = async id => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/deleteQuery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }), // Replace with your desired data to send
        });
        Notification.success({
            title: 'Delete success',
        });
    } catch (e) {
        Notification.error({
            title: 'Delete failed',
        });
    }
};

export const deleteAllQueries = async id => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/deleteAllQueries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        Notification.success({
            title: 'Delete success',
        });
    } catch (e) {
        Notification.error({
            title: 'Delete failed',
        });
    }
};

export const addQuery = async (utilData = {}, appId = null) => {
    const now = new Date().valueOf();
    let queryId;
    try {
        let queryJSON = {
            appId,
            table: '',
            fields: [],
            createdAt: now,
            updatedAt: now,
            ...utilData,
        };
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/addQuery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ queryJSON }), // Replace with your desired data to send
        });

        const data = await response.json();
        queryId = data?.queryId;
        Notification.success({
            title: 'Add Success',
        });
    } catch (e) {
        Notification.error({
            title: 'Add Failed',
        });
    }

    return queryId;
};

export const runQuery = async (
    queryString = '',
    connectConfig = { hostname: null, username: null, password: null, database: null }
) => {
    try {
        if (queryString?.length > 0) {
            const response = await fetch(`${SERVER_URL}/backend/index.php/api/runQuery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sqlValue: queryString, connectConfig }),
            }).then(res => res.json());

            return response?.executionResults ?? null;
        }
        return null;
    } catch (err) {
        return null;
    }
};
