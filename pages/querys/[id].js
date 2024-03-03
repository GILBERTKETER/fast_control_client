import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import ContextMenu from '../../components/context_menu';
import ConfigDrawer from '../../components/config';
import graphState from '../../hooks/use-graph-state';
import QueryNav from '../../components/query_nav';
import { QueryBuilderAntD } from '@react-querybuilder/antd';
import QueryBuilder from 'react-querybuilder';
import { defaultValidator } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
import { useQueryBuilderCtx } from '../../hooks/use-query-builder-ctx';
import { useRouter } from 'next/router';
import { getApplication, getForm, getGraph, getQuery, saveForm, saveQuery } from '../../data/db';
import { useApplicationsCtx } from '../../hooks/use-applications-ctx';
import { PreviewQueryModal } from '../../components/ExportQueryModal';
import { Notification, Button } from '@arco-design/web-react';
import { IconPlus, IconDelete } from '@arco-design/web-react/icon';
import { AddTableModal } from '../../components/modals';
import { Menu } from '@arco-design/web-react';

// const initialQuery = { combinator: 'and', rules: [] };

// const fields = [
//     { name: 'firstName', label: 'First Name' },
//     { name: 'lastName', label: 'Last Name' },
// ];

const defaultInitialQuery = {
    combinator: 'and',
    rules: [],
};

/**
 * 
 * interface IField {
 * name: string;
 * label: string;
 * placeholder: string;
 * defaultOperator?: defaultOperator.name
 * inputType?: HTMLInputTypeAttribute
 * operators?: AllowedOperators
 * valueEditorType?: InputType | 'multiselect'
 * values?: []
 * }
 * 
 * ----default operators----
 * [
  { name: '=', label: '=' },
  { name: '!=', label: '!=' },
  { name: '<', label: '<' },
  { name: '>', label: '>' },
  { name: '<=', label: '<=' },
  { name: '>=', label: '>=' },
  { name: 'contains', label: 'contains' },
  { name: 'beginsWith', label: 'begins with' },
  { name: 'endsWith', label: 'ends with' },
  { name: 'doesNotContain', label: 'does not contain' },
  { name: 'doesNotBeginWith', label: 'does not begin with' },
  { name: 'doesNotEndWith', label: 'does not end with' },
  { name: 'null', label: 'is null' },
  { name: 'notNull', label: 'is not null' },
  { name: 'in', label: 'in' },
  { name: 'notIn', label: 'not in' },
  { name: 'between', label: 'between' },
  { name: 'notBetween', label: 'not between' },
];
 */

export default function Home() {
    const { box, setBox, version, loadGraph, tableDict } = graphState.useContainer();

    const [showModal, setShowModal] = useState('');
    const [showDrawer, setShowDrawer] = useState('');
    const [query, setQuery] = useState({ defaultInitialQuery });

    const {
        getAvailableTables,
        populateTables,
        setQueryName,
        populateInitialSavedQuery,
        populateSelectedTable,
        queryBuilderCtx,
        getSelectedTables,
        populateSelectedTables,
        removeSelectedTable,
        getParsedSelectedTables,
        updateQueryString,
    } = useQueryBuilderCtx();
    const { updateAppName, updateConnectionConfig } = useApplicationsCtx();
    const [availableTables, setAvailableTables] = useState([]);
    const [selectedTables, setSelectedTables] = useState([]);
    const router = useRouter();
    const { appId = null, tableId: tableId, id: queryId, db: dbId, tables } = router.query;
    // const [initialQuery, setInitialQuery] = useState({});
    const [fields, setFields] = useState([]);
    const [queryPreview, setQueryPreview] = useState({
        status: false,
        preview_data: null,
    });
    const [addTablesModal, setAddTablesModal] = useState({
        open: false,
    });
    const [initialSavedQuery, setInitialSavedQuery] = useState(null);

    useHotkeys('ctrl+s, meta+s', () => {}, { preventDefault: true }, [
        // tableDict,
        // linkDict,
        // name,
    ]);

    function toggleQueryPreview() {
        if (queryPreview.status === true) {
            setQueryPreview(prev => ({ ...prev, status: false }));
        } else {
            setQueryPreview(prev => ({ ...prev, status: true }));
        }
    }

    useEffect(() => {
        try {
            if (dbId && appId) {
                const initApplication = async () => {
                    if (appId) {
                        const targetApp = await getApplication(appId);

                        if (targetApp?.connectionConfig) {
                            updateConnectionConfig(targetApp.connectionConfig);
                        }

                        if (targetApp?.name) {
                            updateAppName(targetApp.name);
                        }
                    }
                };
                const initQuery = async () => {
                    if (queryId) {
                        const targetQuery = await getQuery(queryId);

                        if (targetQuery?.name) {
                            setQueryName(targetQuery.name);
                        }
                        if (targetQuery?.task_data) {
                            populateInitialSavedQuery(targetQuery.task_data);
                        }

                        if (targetQuery?.query) {
                            setQuery(targetQuery.query);
                            setInitialSavedQuery(targetQuery.query);
                        }

                        if (targetQuery?.queryString) {
                            updateQueryString(targetQuery.queryString);
                        }
                    }
                };
                const initGraph = async () => {
                    const graphData = await getGraph(dbId);
                    initApplication();
                    initQuery();

                    if (graphData?.tableDict) {
                        const table_ids = Object.keys(graphData.tableDict);

                        const availableTablesConstruct = table_ids.map(tid => ({
                            id: tid,
                            name: graphData.tableDict[tid]?.name ?? '_',
                            fields: graphData.tableDict[tid]?.fields ?? [],
                        }));

                        setAvailableTables(availableTablesConstruct);
                        populateTables(availableTablesConstruct);
                        // loadGraph(graphData);
                    }
                };

                initGraph();
            } else {
                // alert('No app ID');
                // console.log('NO_APP_ID');
            }
        } catch (err) {
            console.log(err);
        }
    }, [dbId, appId]);

    function initializeFields() {
        if (appId) {
            const targetTable = [...availableTables].find(table_ => table_.id === tableId);

            // console.log(
            //     'targetTables',
            //     getSelectedTables()?.map(s_table => ({
            //         ...s_table,
            //         fields:
            //             s_table?.fields?.map(s_table_field => ({
            //                 name: s_table_field?.id,
            //                 label: s_table_field?.name,
            //                 placeholder: s_table_field?.name,
            //             })) ?? [],
            //     }))
            // );

            if (targetTable?.fields) {
                const parsedFields = targetTable?.fields?.map(_field_ => {
                    return {
                        name: _field_?.name,
                        label: _field_?.name,
                        placeholder: _field_?.name,
                    };
                });

                setFields(parsedFields);
            }
        }
    }

    useEffect(() => {
        if (initialSavedQuery) {
            const currentAvailableTables = queryBuilderCtx?.availableTables.map(at => at.id);
            const previouslySelectedTableIds = Object.keys(initialSavedQuery).filter(q_ =>
                currentAvailableTables.includes(q_)
            );

            populateSelectedTables(previouslySelectedTableIds);

            initializeFields();
        }
    }, [initialSavedQuery, queryBuilderCtx?.availableTables, tableDict]);

    useEffect(() => {
        initializeFields();
    }, [appId, availableTables, queryBuilderCtx?.selectedTables, initialSavedQuery]);

    function handleTableSwitch(e) {
        const chosenTableId = e?.target?.value ?? null;
        if (chosenTableId) {
            router.push(
                `/querys/${queryId}?appId=${appId}&tableId=${chosenTableId}&db=${dbId}&myArray=[1234,1243]`,
                null,
                {
                    shallow: false,
                }
            );
        }
    }

    async function handleSaveQuery() {
        try {
            await saveQuery(queryId, {
                name: queryBuilderCtx?.queryName ?? '_',
                query,
                queryString: queryBuilderCtx?.queryString ?? '',
            });
        } catch (err) {
            console.log(err);
            Notification.error({
                title: 'Failed to save query. Please Try Again',
            });
        }
    }

    function toggleAddTablesModal() {
        if (addTablesModal.open) {
            setAddTablesModal(prev => ({ ...prev, open: false }));
        } else {
            setAddTablesModal(prev => ({ ...prev, open: true }));
        }
    }

    function removeTableFromQuery(table_id) {
        if (table_id) {
            setQuery(prev => {
                const {
                    [table_id]: {},
                    ...rest
                } = prev;

                return rest;
            });
        }
    }

    return (
        <QueryBuilderAntD>
            <div className="graph">
                <Head>
                    <title>FastControl</title>
                    <meta name="description" content="Web Application design tool" />
                    <link rel="icon" href="/favicon.ico" />
                    <link
                        rel="stylesheet"
                        href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                        crossorigin="anonymous"
                    ></link>
                    <script
                        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
                        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
                        crossorigin="anonymous"
                        defer
                    ></script>
                    <link
                        rel="stylesheet"
                        href="https://use.fontawesome.com/releases/v5.13.0/css/all.css"
                    ></link>
                    <link
                        rel="stylesheet"
                        type="text/css"
                        href="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"
                    ></link>
                </Head>
                <ContextMenu setShowModal={setShowModal}></ContextMenu>
                <QueryNav
                    setShowModal={setShowModal}
                    setShowDrawer={setShowDrawer}
                    previewClickHandler={toggleQueryPreview}
                    saveClickHandler={handleSaveQuery}
                />
                <ConfigDrawer showDrawer={showDrawer} onCloseDrawer={() => setShowDrawer('')} />
                <PreviewQueryModal
                    visible={queryPreview?.status ?? false}
                    onCancelHandler={toggleQueryPreview}
                    query={query}
                />
                <AddTableModal
                    visible={addTablesModal.open}
                    onCancelHandler={toggleAddTablesModal}
                />

                <div className="app-content form-builder">
                    <div className="form-builder-utils">
                        <div className="fbu-tables">
                            <div
                                className="fbu-tables-content"
                                style={{ display: 'flex', flexDirection: 'column' }}
                            >
                                <span>Add a Table</span>
                                {/* <select className="form-control" onChange={handleTableSwitch}>
                                    <option value={'_'}>-- Choose a table ---</option>
                                    {getAvailableTables().map((available_table, ix) => (
                                        <option
                                            key={available_table?.id ?? ix}
                                            value={available_table.id ?? null}
                                            selected={available_table?.id === selectedTable?.id}
                                        >
                                            {available_table.name ?? '_'}
                                        </option>
                                    ))}
                                </select> */}
                                <Button onClick={toggleAddTablesModal}>
                                    {/* onClick, open a modal for adding the tables from a multiselect input listing all available tables */}
                                    <IconPlus />
                                </Button>
                            </div>
                        </div>
                        <div className="fbu-tables">
                            <div className="fbu-tables-content">
                                <span>Tables</span>
                                <Menu>
                                    {getParsedSelectedTables().map((selected_table, ix) => (
                                        <Menu.Item
                                            key={ix}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            {selected_table?.name}
                                            <span>
                                                <Button
                                                    className="arco-custom-btn-icon"
                                                    shape="round"
                                                    size="small"
                                                    type="text"
                                                    icon={<IconDelete />}
                                                    style={{
                                                        padding: 0,
                                                        aspectRatio: 1,
                                                        outline: 'none',
                                                    }}
                                                    iconOnly={true}
                                                    onClick={() => {
                                                        removeSelectedTable(selected_table?.id);

                                                        removeTableFromQuery(selected_table?.id);
                                                    }}
                                                />
                                            </span>
                                        </Menu.Item>
                                    ))}
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <div className="ac-window acw-overflow acw-query-builder">
                        {getParsedSelectedTables().length > 0 ? (
                            getParsedSelectedTables().map(table => (
                                <QueryBuilder
                                    key={table?.id}
                                    fields={table?.fields}
                                    query={query[table?.id] ?? defaultInitialQuery}
                                    onQueryChange={q => {
                                        setQuery(prev => ({ ...prev, [table?.id]: q }));
                                    }}
                                />
                            ))
                        ) : (
                            <h3>No tables Selected</h3>
                        )}
                    </div>
                </div>
            </div>
        </QueryBuilderAntD>
    );
}
