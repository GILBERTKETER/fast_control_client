import { dbAdaptor } from './settings';

const dbc = {
    indexed: require('./adaptor/indexed'),
}[dbAdaptor];

export const getAllGraphs = async () => await dbc.getAllGraphs();

export const getGraph = async id => await dbc.getGraph(id);

export const saveGraph = async args => await dbc.saveGraph(args);

export const delGraph = async id => await dbc.delGraph(id);

export const deleteAllGraphs = async () => await dbc.deleteAllGraphs();

export const addGraph = async (graph = {}, id = null) => await dbc.addGraph(graph, id);

// For Application
export const getAllApplications = async () => await dbc.getAllApplications();

export const getApplication = async id => await dbc.getApplication(id);

export const saveApplication = async (utilData = {}, appId = null) =>
    await dbc.saveApplication(utilData, appId);

export const delApplication = async id => await dbc.delApplication(id);

export const addApplication = async (application = {}, id = null) =>
    await dbc.addApplication(application, id);

export const getLogs = async id => await dbc.getLogs(id);

export const delLogs = async id => await dbc.delLogs(id);

// For Query
export const getAllQueries = async () => await dbc.getAllQueries();

export const getQuery = async id => await dbc.getQuery(id);

export const saveQuery = async (queryId = null, utilData = {}) =>
    await dbc.saveQuery(queryId, utilData);

export const delQuery = async id => await dbc.delQuery(id);

export const addQuery = async (utilData = {}, id = null) => await dbc.addQuery(utilData, id);

export const deleteAllQueries = async () => await dbc.deleteAllQueries();

export const getAllQueriesByApplication = async (appId = null) =>
    await dbc.getAllQueriesByApplication(appId);

export const runQuery = async (
    queryString = '',
    connectConfig = { hostname: null, username: null, password: null, database: null }
) => await dbc.runQuery(queryString, connectConfig);

// For Form
export const getAllForms = async () => await dbc.getAllForms();

export const getForm = async id => await dbc.getForm(id);

export const saveForm = async (formId, utilData = {}) => await dbc.saveForm(formId, utilData);

export const delForm = async id => await dbc.delForm(id);

export const addForm = async (form = {}, appId = null) => await dbc.addForm(form, appId);

export const getAllFormsByApplication = async (appId = null) =>
    await dbc.getFormsByApplication(appId);
