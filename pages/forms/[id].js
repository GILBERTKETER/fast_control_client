import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import ContextMenu from '../../components/context_menu';
import ConfigDrawer from '../../components/config';
import graphState from '../../hooks/use-graph-state';
import FormNav from '../../components/form_nav';
// import { ReactFormBuilder } from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { IconLink, IconMoreVertical } from '@arco-design/web-react/icon';
import { Menu } from '@arco-design/web-react';
import { getApplication, getForm, getGraph, saveForm } from '../../data/db';
import FormElementsEdit from '../../components/formbuilder/form-elements-edit';
import CustomFormElementsEdit from '../../components/formbuilder/form-elements-edit';
import { useFormBuilderCtx } from '../../hooks/use-form-builder-ctx';
// import { Registry } from 'react-form-builder2';
import { CheckBox } from '../../components/formbuilder/FormBuilderCheckbox';
import { available_items_library, getItemTemplateBy } from '../../components/form_builder_items';
import { uuid } from '../../components/formbuilder/UUID';
import { CustomReactFormBuilder } from '../../components/CustomReactFormBuilder';
// import { ReactFormBuilder } from '../../react-form-builder';
import { FormPreviewModal } from '../../components/FormPreviewModal';
import { mapDataTypeToElement } from '../../utils/helpers';
import store from '../../react-form-builder/src/stores/store';
import { Notification } from '@arco-design/web-react';
import { useApplicationsCtx } from '../../hooks/use-applications-ctx';
import ApplicationConfigDrawer from '../../components/ApplicationConfigDrawer';
import { SERVER_URL } from '../../config';
import { Button } from 'antd';
import { Dropdown } from '@arco-design/web-react';
import { ChangeFormInputFieldModal } from '../../components/modals/ChangeFormInputFieldModal';

const ReactFormBuilder = dynamic(
    () => import('../../react-form-builder').then(mod => mod.ReactFormBuilder),
    { ssr: false }
);

const sampleFields = [
    {
        label: 'Username',
        isLinked: false,
    },
    {
        label: 'Email',
        isLinked: true,
    },
];

export default function Home() {
    const router = useRouter();
    const { appId = null, tableId: tableId, id: formId, db: dbId } = router.query;
    const { box, setBox, version, tableList, loadGraph, tableDict, linkDict } =
        graphState.useContainer();
    const [fields, setFields] = useState([...sampleFields]);
    const [selectedTable, setSelectedTable] = useState({
        id: '',
        name: '',
        fields: [],
    });
    const [availableTables, setAvailableTables] = useState([]);
    // const [tableDict, setTableDict] = useState({});
    const {
        populateTables,
        populateFields,
        unmarkLinkedField,
        markFieldAsLinked,
        populateSelectedTable,
        getAvailableTables,
        getSelectedTable,
        formBuilderCtx,
        getFormName,
        populateLinkDict,
        setFormName,
        populateInitialSavedForm,
        getTableById,
        unlinkElement,
        changeOptionsConfig,
        loadInitialOptionsConfig,
        changeCustomFieldInput,
    } = useFormBuilderCtx();
    const [formBuildData, setFormBuildData] = useState();
    const [initialParsedFields, setInitialParsedFields] = useState([]);
    const [formPreview, setFormPreview] = useState({
        status: false,
        preview_data: null,
    });
    const FORM_SAVE_URL = `/api/forms/formdata?formId=${formId}&tableId=${tableId}&appId=${appId}&db=${dbId}`;
    const { updateAppName, updateConnectionConfig, applicationsCtx } = useApplicationsCtx();
    const [formInputChangeModal, setFormInputChangeModal] = useState({
        isOpen: false,
        field: null,
    });

    const svg = useRef();

    const [showModal, setShowModal] = useState('');
    const [showDrawer, setShowDrawer] = useState('');

    useHotkeys('ctrl+s, meta+s', () => updateForm(), { preventDefault: true }, [
        // tableDict,
        // linkDict,
        // name,
    ]);

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
                const initForm = async () => {
                    if (formId) {
                        const targetForm = await getForm(formId);

                        if (targetForm?.name) {
                            setFormName(targetForm.name);
                        }
                        if (targetForm?.task_data) {
                            populateInitialSavedForm(targetForm);
                        }

                        if (targetForm?.optionsConfig) {
                            loadInitialOptionsConfig(targetForm.optionsConfig);
                        }
                    }
                };
                const initGraph = async () => {
                    const graphData = await getGraph(dbId);
                    initApplication();
                    initForm();

                    if (graphData?.tableDict) {
                        loadGraph(graphData);
                        // setTableDict(graphData.tableDict);
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

    useEffect(() => {
        if (Object.keys(tableDict).length > 0) {
            const table_ids = Object.keys(tableDict);

            const availableTablesConstruct = table_ids.map(tid => ({
                id: tid,
                name: tableDict[tid]?.name ?? '_',
                fields: tableDict[tid]?.fields ?? [],
            }));

            setAvailableTables(availableTablesConstruct);
            populateTables(availableTablesConstruct);
            return () => {
                setAvailableTables([]);
            };
        }
    }, [tableDict]);

    function handleTableSwitch(e) {
        const chosenTableId = e?.target?.value ?? null;
        if (chosenTableId) {
            router.push(
                `/forms/${formId}?appId=${appId}&tableId=${chosenTableId}&db=${dbId}`,
                null,
                {
                    shallow: false,
                }
            );
            // }
        }
    }

    async function handleFormSave() {
        try {
            await triggerFormSave('db');
            Notification.success({
                title: 'Successfully saved form state',
            });
        } catch (err) {
            console.log(err);
            Notification.error({
                title: 'Failed to save form state',
            });
            return null;
        }
    }

    async function triggerFormSave(target) {
        if (store) {
            store.dispatch('post');
        }
        if (target === 'db') {
            await saveForm(formId, {
                name: formBuilderCtx?.formName ?? '_',
                task_data: store.state.data,
                table: tableId ?? null,
                tableName: getSelectedTable()?.name,
                optionsConfig: formBuilderCtx?.optionsConfig ?? {
                    null: { labelField: null, valueField: null },
                },
            });
        }
    }

    useEffect(() => {
        async function parseFormBuilderFields() {
            if (appId && tableId) {
                const targetTable = [...availableTables].find(table_ => table_.id === tableId);
                setSelectedTable(targetTable);

                populateSelectedTable(targetTable);

                if (targetTable) {
                    // console.log('LinkDICT: ', linkDict);
                    const links = Object.keys(linkDict)
                        .map(key => ({
                            ...linkDict[key],
                        }))
                        .map(link => ({
                            ...link,
                        }));

                    const linkedFields = links
                        .map(lnk => lnk?.endpoints?.map(ep => ep.fieldId) ?? [])
                        .flat();

                    const resolvedFields = await Promise.all(
                        targetTable?.fields?.map(async field => {
                            if (field?.increment == true) {
                                return null;
                            }
                            if (linkedFields.includes(field.id)) {
                                field.type = 'CHOICE';
                                // get the table name and pass it to the SQL query

                                const targetLink = links
                                    .find(lnk =>
                                        lnk.endpoints.map(ep => ep.fieldId).includes(field.id)
                                    )
                                    .endpoints.find(end_point => end_point.id !== targetTable.id);

                                // get the table name
                                const related_table = getTableById(targetLink.id);

                                if (!related_table) {
                                    return null;
                                }

                                const fetchTableRows = async () => {
                                    try {
                                        const exportType = 'mysql';
                                        const sqlValue = `SELECT * from \`${related_table.name}\``;
                                        const response = await fetch(
                                            `${SERVER_URL}/backend/index.php/api/runQuery`,
                                            {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    sqlValue: sqlValue,
                                                    connectConfig: applicationsCtx.connectionConfig,
                                                }), // Replace with your desired data to send
                                            }
                                        );

                                        const data = await response.json();

                                        // await window.navigator.clipboard.writeText(sqlValue);
                                        Notification.success({
                                            title: '',
                                            content: `Query execution summary: 
                                            ${data['successCount']} queries executed successfully, ${data['failedCount']} queries failed.`,
                                        });
                                        return data?.executionResults.length > 0
                                            ? data?.executionResults[0]?.result
                                            : null;
                                    } catch (e) {
                                        console.log(e);
                                        Notification.error({
                                            title: 'Database Error',
                                        });
                                        return null;
                                    }
                                };

                                const tableRows = await fetchTableRows();

                                // fetch the columns
                                if (tableRows?.length > 0) {
                                    const columns = Object.keys(tableRows[0]);

                                    changeOptionsConfig(field.id, {
                                        availableOptions: columns,
                                    });
                                }

                                changeCustomFieldInput(field.id, { element: 'Dropdown' });

                                return getItemTemplateBy(
                                    'element',
                                    mapDataTypeToElement(field.type),
                                    {
                                        label: field.name,
                                        field_name: field.name,
                                        field_id: field.id,
                                        options: tableRows?.map((r, ix) => ({
                                            text: r[
                                                formBuilderCtx?.optionsConfig[field.id]
                                                    ?.labelField ?? null
                                            ],
                                            value: r[
                                                formBuilderCtx?.optionsConfig[field.id]
                                                    ?.valueField ?? '_'
                                            ],
                                            key: ix,
                                        })),
                                        optionsApiURL: 'https://coolendpoint.com',
                                    }
                                );
                            }

                            // query the database for the data/list and populate it
                            // or use a url to get the data => much easier and efficient

                            return getItemTemplateBy('element', mapDataTypeToElement(field.type), {
                                label: field.name,
                                field_name: field.name,
                                field_id: field.id,
                            });
                        })
                    );
                    const parsedFields = resolvedFields
                        .filter(_item_ => _item_)
                        .map((fld, ix) => {
                            fld['id'] = `${uuid()}_${ix}`;
                            markFieldAsLinked(fld.field_id, fld.id);
                            return fld;
                        });

                    const headerElement = {
                        ...getItemTemplateBy('element', 'Header'),
                        id: uuid(),
                        content: targetTable?.name,
                    };

                    setInitialParsedFields([headerElement, ...parsedFields]);

                    // update form builder store
                    store.dispatch('load', {
                        loadUrl: null,
                        saveUrl: FORM_SAVE_URL,
                        data: [headerElement, ...parsedFields],
                        saveAlways: true,
                    });

                    return;
                }
            }
        }

        parseFormBuilderFields();
    }, [appId, tableId, availableTables, formBuilderCtx?.initialSavedForm]);

    async function toggleFormPreview() {
        if (formPreview.status === true) {
            setFormPreview({ status: false, preview_data: null });
            return;
        } else {
            // fetch JSON data for rendering on the form
            await triggerFormSave();
            const formPreviewData = await fetch(`/api/forms/formdata?formId=${formId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(res => res.json());

            setFormPreview({ status: true, preview_data: formPreviewData?.task_data ?? [] });
            return;
        }
    }

    function toggleFormInputChangeModal(field) {
        if (formInputChangeModal.isOpen === true) {
            setFormInputChangeModal(prev => ({ ...prev, isOpen: false, field: null }));
            return;
        } else {
            setFormInputChangeModal(prev => ({ ...prev, isOpen: true, field }));
            return;
        }
    }

    function shouldRenderUtilOptionsButton(fieldType) {
        switch (fieldType) {
            case 'CHOICE':
                return true;
            default:
                return false;
        }
    }

    function renderDropListByFieldType(fieldType, field, disable = []) {
        switch (fieldType) {
            case 'CHOICE':
                return (
                    <Menu>
                        <Menu.Item
                            key="1"
                            onClick={() => {
                                toggleFormInputChangeModal(field);
                            }}
                        >
                            Change Input Field
                        </Menu.Item>
                    </Menu>
                );
            default:
                return null;
        }
    }

    useEffect(() => {
        // resolve the field input types
        const existingElements = [...store.state.data].map((elm, ix) => {
            const targetElement = formBuilderCtx.customFieldInputs[elm?.field_id];
            const { field_id, field_name, id, label, options, optionsApiURL } = elm;

            if (targetElement) {
                const generatedElement = getItemTemplateBy('element', targetElement.element, {
                    field_id,
                    field_name,
                    id,
                    label,
                    options,
                    optionsApiURL,
                });

                elm = generatedElement;
            }

            return elm;
        });

        setInitialParsedFields(existingElements);
        store.dispatch('load', {
            loadUrl: null,
            saveUrl: FORM_SAVE_URL,
            data: existingElements,
            saveAlways: true,
        });
    }, [formBuilderCtx.customFieldInputs]);

    return (
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
            <FormNav
                setShowModal={setShowModal}
                setShowDrawer={setShowDrawer}
                previewClickHandler={toggleFormPreview}
                saveClickHandler={handleFormSave}
            />
            <ApplicationConfigDrawer
                showDrawer={showDrawer}
                onCloseDrawer={() => setShowDrawer('')}
            />
            <div className="app-content form-builder">
                <div className="form-builder-utils">
                    <div className="fbu-tables">
                        <div className="fbu-tables-content">
                            <span>Select Table</span>
                            <select className="form-control" onChange={handleTableSwitch}>
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
                            </select>
                        </div>
                    </div>
                    <div className="fbu-fields">
                        <div className="fbu-fields-content">
                            <span className="fbu-fields-title">Fields</span>
                            {/* <ul>
                                {fields.map(field_ => {
                                    return (
                                        <li>
                                            {field_.label}{' '}
                                            <span>{field_.isLinked ? <IconLink /> : <></>}</span>
                                        </li>
                                    );
                                })}
                            </ul> */}
                            <Menu>
                                {getSelectedTable()?.fields.length > 0 &&
                                    getSelectedTable()?.fields?.map((field_, i) => {
                                        return (
                                            <Menu.Item key={i}>
                                                {field_.name}{' '}
                                                <span>
                                                    <span
                                                        className={`is-linked-${
                                                            field_.isLinked?.status ?? false
                                                        }`}
                                                    >
                                                        {field_?.isLinked?.status ? (
                                                            <IconLink />
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </span>
                                                    {shouldRenderUtilOptionsButton(field_.type) ? (
                                                        <Dropdown
                                                            trigger={'click'}
                                                            droplist={renderDropListByFieldType(
                                                                field_.type,
                                                                field_
                                                            )}
                                                        >
                                                            <Button
                                                                className="arco-custom-btn-icon"
                                                                shape="round"
                                                                size="small"
                                                                type="text"
                                                                icon={<IconMoreVertical />}
                                                                style={{
                                                                    padding: 0,
                                                                    aspectRatio: 1,
                                                                }}
                                                                iconOnly={true}
                                                            />
                                                        </Dropdown>
                                                    ) : (
                                                        <Button
                                                            type="text"
                                                            shape="round"
                                                            size="small"
                                                            style={{ visibility: 'hidden' }}
                                                        ></Button>
                                                    )}
                                                </span>
                                            </Menu.Item>
                                        );
                                    })}
                            </Menu>
                        </div>
                    </div>
                </div>
                {/* <button onClick={testMutateFormData}>Test</button> */}
                <div className="ac-window acw-overflow">
                    {tableId ? (
                        typeof window !== 'undefined' && (
                            <ReactFormBuilder
                                className="form-builder-wrapper"
                                data={initialParsedFields}
                                initialData={initialParsedFields}
                                saveUrl={FORM_SAVE_URL}
                                toolbarItems={available_items_library}
                                renderEditForm={props => (
                                    <CustomFormElementsEdit
                                        selectedTable={getSelectedTable()}
                                        onFieldLinkSelect={(selected_value, elm_id) => {
                                            if (elm_id) markFieldAsLinked(selected_value, elm_id);
                                            if (!selected_value) unlinkElement(elm_id);
                                        }}
                                        handleOptionLabelFieldChange={(fieldId, val) => {
                                            changeOptionsConfig(fieldId, { labelField: val });
                                        }}
                                        handleOptionValueFieldChange={(fieldId, val) => {
                                            changeOptionsConfig(fieldId, { valueField: val });
                                        }}
                                        // optionFieldValues={{
                                        //     labelField: formBuilderCtx?.optionsConfig?.labelField,
                                        //     valueField: formBuilderCtx?.optionsConfig?.valueField,
                                        // }}
                                        optionsConfig={formBuilderCtx.optionsConfig}
                                        fieldRelationOptions={
                                            formBuilderCtx?.optionsConfig?.availableOptions
                                        }
                                        {...props}
                                    />
                                )}
                            />
                        )
                    ) : (
                        <h3>No Table Selected</h3>
                    )}
                    {/* <button>{uuid()}</button> */}
                </div>
            </div>
            <FormPreviewModal
                key={'jdfjfw'}
                formName={getFormName()}
                visible={formPreview.status}
                taskData={formPreview?.preview_data ?? []}
                onCancelHandler={toggleFormPreview}
                formId={formId}
                tableName={getSelectedTable()?.name}
            />
            <ChangeFormInputFieldModal
                key={'jfsidjfi'}
                visible={formInputChangeModal.isOpen}
                onCancelHandler={toggleFormInputChangeModal}
                field={formInputChangeModal.field}
            />
        </div>
    );
}

// const item = {
//     element: '',
//     key: '',
//     name: '',
//     group_name: '',
//     static: ''
// }

// 1 to * relationship => checkboxes/multiselect on 1
// 1 to 1 relationship => dropdown on either
