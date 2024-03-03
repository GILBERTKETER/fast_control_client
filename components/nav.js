import {
    Button,
    Space,
    Popconfirm,
    Input,
    Switch,
    Dropdown,
    Menu,
    Notification,
} from '@arco-design/web-react';
import { IconSunFill, IconMoonFill, IconLeft } from '@arco-design/web-react/icon';
import Link from 'next/link';
import { nanoid } from 'nanoid';
import graphState from '../hooks/use-graph-state';
import tableModel from '../hooks/table-model';
import exportSQL from '../utils/export-sql';
import { Parser } from '@dbml/core';
import { SERVER_URL } from '../config';

/**
 * It renders a nav bar with a title, a save button, a demo button, a clear button, an export button,
 * and a name input
 * @param props - the props passed to the component
 * @returns A Nav component that takes in a title, a save button, a demo button, a clear button, an export button
 */
export default function Nav({ setShowModal, setShowDrawer }) {
    const { name, setName, theme, setTheme, setTableDict, setLinkDict, version } =
        graphState.useContainer();
    const { updateGraph, addTable, applyVersion } = tableModel();
    const { tableDict, linkDict, tableList, connectConfig } = graphState.useContainer();
    const { calcXY } = tableModel();

    const executeMySQLQuery = async () => {
        try {
            const exportType = 'mysql';
            const sqlValue = exportSQL(tableDict, linkDict, exportType);
            const response = await fetch(`${SERVER_URL}/backend/index.php/api/mysqlquery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sqlValue: sqlValue, connectConfig: connectConfig }), // Replace with your desired data to send
            });

            const data = await response.json();

            // await window.navigator.clipboard.writeText(sqlValue);
            Notification.success({
                title: 'Created Tables',
                content: `Query execution summary: 
                ${data['successCount']} queries executed successfully, ${data['failedCount']} queries failed.`,
            });
        } catch (e) {
            console.log(e);
            Notification.error({
                title: 'Database Error',
            });
        }
    };

    const handlerDumpAsGraph = async () => {
        let value = '';
        try {
            const response = await fetch(`${SERVER_URL}/backend/index.php/api/mysqldump`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ connectConfig: connectConfig }), // Replace with your desired data to send
            });

            const data = await response.json();

            value = data?.dumpSQL;
            // await window.navigator.clipboard.writeText(sqlValue);
            Notification.success({
                title: 'Dump successfully.',
            });
        } catch (e) {
            console.log(e);
            Notification.error({
                title: 'Database Error',
            });
        }
        try {
            const result = await Parser.parse(value, 'mysql');
            const graph = result.schemas[0];
            const tableDict = {};
            const linkDict = {};
            const tables = [...tableList];
            graph.tables.forEach((table, index) => {
                const id = nanoid();
                const [x, y] = calcXY(0, tables);
                const newTable = {
                    id,
                    name: table.name,
                    note: table.note,
                    x,
                    y,
                    fields: table.fields.map(field => {
                        const fieldId = nanoid();
                        return {
                            id: fieldId,
                            increment: field.increment,
                            name: field.name,
                            not_null: field.not_null,
                            note: field.note,
                            pk: field.pk,
                            unique: field.unique,
                            type: field.type.type_name.toUpperCase(),
                        };
                    }),
                };
                tableDict[id] = newTable;
                tables.push(newTable);
            });

            graph.refs.forEach(ref => {
                const id = nanoid();
                linkDict[id] = {
                    id,
                    endpoints: ref.endpoints.map(endpoint => {
                        const table = Object.values(tableDict).find(
                            table => table.name === endpoint.tableName
                        );
                        return {
                            id: table.id,
                            relation: endpoint.relation,
                            fieldId: table.fields.find(
                                field => field.name === endpoint.fieldNames[0]
                            ).id,
                        };
                    }),
                };
            });

            setTableDict(state => ({
                ...state,
                ...tableDict,
            }));
            setLinkDict(state => ({
                ...state,
                ...linkDict,
            }));
        } catch (e) {
            console.log(e);
            Notification.error({
                title: 'Parse failed',
            });
        }
    };

    if (version !== 'currentVersion') {
        return (
            <nav className="nav">
                <div className="nav-title">Logs Record: {name}</div>
                <Space>
                    <Button
                        onClick={() => updateGraph()}
                        type="primary"
                        status="success"
                        shape="round"
                        style={{ marginLeft: 8 }}
                    >
                        Apply Select Version
                    </Button>
                    <Button
                        onClick={() => applyVersion('currentVersion')}
                        shape="round"
                        style={{ marginLeft: 8 }}
                    >
                        Exit Logs View
                    </Button>
                </Space>
            </nav>
        );
    }

    return (
        <nav className="nav">
            <Space>
                <Link href="/graphs" passHref>
                    <IconLeft style={{ fontSize: 20 }} />
                </Link>
                <Input
                    type="text"
                    value={name}
                    onChange={value => setName(value)}
                    style={{ width: '240px' }}
                />
            </Space>

            <Space>
                <Button
                    size="small"
                    type="primary"
                    status="success"
                    shape="round"
                    onClick={() => updateGraph()}
                >
                    Save
                </Button>
                <Dropdown
                    position="bottom"
                    droplist={
                        <Menu>
                            <Menu.Item
                                key="add"
                                className="context-menu-item"
                                onClick={() => addTable()}
                            >
                                Add Table
                            </Menu.Item>
                            <Menu.Item
                                key="import"
                                className="context-menu-item"
                                onClick={() => setShowModal('import')}
                            >
                                Import Table
                            </Menu.Item>
                        </Menu>
                    }
                >
                    <Button size="small" type="primary" shape="round">
                        + New Table
                    </Button>
                </Dropdown>
                <Popconfirm
                    title="Are you sure you want to delete all the tables?"
                    okText="Yes"
                    cancelText="No"
                    position="br"
                    onOk={() => {
                        setTableDict({});
                        setLinkDict({});
                    }}
                >
                    <Button size="small" type="outline" status="danger" shape="round">
                        Clear
                    </Button>
                </Popconfirm>
                <Button
                    size="small"
                    type="primary"
                    status="success"
                    shape="round"
                    onClick={() => handlerDumpAsGraph()}
                >
                    Show Database
                </Button>
                <Button
                    size="small"
                    type="outline"
                    shape="round"
                    onClick={() => setShowModal('export')}
                >
                    Preview query
                </Button>
                <Button
                    size="small"
                    type="primary"
                    shape="round"
                    onClick={() => executeMySQLQuery()}
                >
                    Execute Query & Create Tables
                </Button>
                {/* <Button
                    size="small"
                    type="secondary"
                    shape="round"
                    onClick={() => setShowDrawer('logs')}
                >
                    Logs
                </Button> */}
                <Button
                    size="small"
                    type="outline"
                    shape="round"
                    onClick={() => setShowDrawer('config')}
                >
                    Config
                </Button>
                <Button size="small" type="primary" shape="round" onClick={() => {}}>
                    Query Builder
                </Button>
                <Switch
                    checkedIcon={<IconMoonFill />}
                    uncheckedIcon={<IconSunFill />}
                    checked={theme === 'dark'}
                    onChange={e => setTheme(e ? 'dark' : 'light')}
                />
            </Space>
        </nav>
    );
}
