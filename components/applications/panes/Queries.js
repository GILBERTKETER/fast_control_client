import { useEffect, useState } from 'react';
import {
    List,
    Button,
    Empty,
    Space,
    Avatar,
    Popconfirm,
    Notification,
    Divider,
    Tag,
} from '@arco-design/web-react';
import {
    IconEdit,
    IconDelete,
    IconNav,
    IconCalendarClock,
    IconCopy,
} from '@arco-design/web-react/icon';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    addForm,
    addQuery,
    getAllForms,
    getAllFormsByApplication,
    getAllQueriesByApplication,
    delQuery,
} from '../../../data/db';
import { useApplicationsCtx } from '../../../hooks/use-applications-ctx';

export const sampleForms = [
    {
        name: 'Form 1',
        box: { x: 0, y: 0, w: 683, h: 654, clientW: 683, clientH: 654 },
        connectConfig: {
            hostname: 'localhost',
            username: 'root',
            password: '',
            database: 'graph_database',
        },
        createdAt: 1701170428873,
        updatedAt: 1701170428873,
        id: '10',
    },
    {
        name: 'Form app',
        box: { x: 0, y: 0, w: 1366, h: 654, clientW: 1366, clientH: 654 },
        connectConfig: {
            hostname: 'localhost',
            username: 'root',
            password: '',
            database: 'graph_database',
        },
        createdAt: 1701169162688,
        updatedAt: 1701169162688,
        id: '9',
    },
];

export const Queries = ({}) => {
    const [queries, setQueries] = useState([]);
    const router = useRouter();
    const { id: applicationId } = router.query;
    const { applicationsCtx } = useApplicationsCtx();

    async function handleNewQuery() {
        try {
            // make API call
            const new_query_id = await addQuery({
                name: `Untitled form ${queries.length}`,
                appId: applicationId,
            });
            if (new_query_id) {
                router.push(
                    `/querys/${new_query_id}?appId=${applicationId}&db=${
                        applicationsCtx?.connectionConfig?.database_id ?? null
                    }`
                );
            }
        } catch (err) {
            console.log(err);
            return;
        }
    }

    async function fetchForms() {
        // populate form data
    }

    const deleteQuery = async id => {
        await delQuery(id);
        setQueries(state => state.filter(item => item.id !== id));
    };

    useEffect(() => {
        // getAllForms();
        const initQueries = async () => {
            const queries = await getAllQueriesByApplication(applicationId);

            setQueries(queries ?? []);
        };

        initQueries();
    }, []);

    return (
        <div className="forms-wrapper">
            <div className="forms-col">
                {/* forms here */}
                {queries && queries.length ? (
                    <List
                        className="graph-list"
                        size="large"
                        header="Queries"
                        dataSource={queries}
                        render={(item, index) => (
                            <List.Item
                                key={item.id}
                                extra={
                                    <Space>
                                        <Link
                                            href={`/querys/${item.id}?appId=${item.appId}&tableId=${
                                                item?.table ?? null
                                            }&db=${
                                                applicationsCtx?.connectionConfig?.database_id ??
                                                null
                                            }`}
                                        >
                                            <Button type="primary" icon={<IconEdit />} />
                                        </Link>
                                        <Popconfirm
                                            title="Are you sure to delete this query?"
                                            okText="Yes"
                                            cancelText="No"
                                            position="br"
                                            onOk={() => deleteQuery(item.id)}
                                        >
                                            <Button
                                                type="primary"
                                                status="danger"
                                                icon={<IconDelete />}
                                            />
                                        </Popconfirm>
                                    </Space>
                                }
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar shape="square">
                                            {item?.name?.length > 0 ? item.name[0] : '_'}
                                        </Avatar>
                                    }
                                    title={item.name ?? '_'}
                                    description={
                                        <Space style={{ marginTop: 4 }}>
                                            <Tag color="green" icon={<IconCopy />}>
                                                createdAt{' '}
                                                {new Date(item.createdAt).toLocaleString()}
                                            </Tag>
                                            <Tag color="gold" icon={<IconCalendarClock />}>
                                                updatedAt{' '}
                                                {new Date(item.updatedAt).toLocaleString()}
                                            </Tag>
                                        </Space>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <div className="graph-list-btns">
                        <Button
                            size="large"
                            type="primary"
                            onClick={() => {
                                handleNewQuery();
                            }}
                        >
                            Create new Query now
                        </Button>
                        <Divider orientation="center">
                            {' '}
                            * Design database with FastControl *{' '}
                        </Divider>
                        {/* <Button size="large" type="outline" onClick={() => handlerAddExample()}>
                            Create new graph example
                        </Button> */}
                    </div>
                )}
            </div>
            <div className="forms-col">
                <div className="graph-list-btns">
                    <Button
                        size="large"
                        type="primary"
                        onClick={() => {
                            handleNewQuery();
                        }}
                    >
                        Create new Query now
                    </Button>
                    <Divider orientation="center"></Divider>
                    {/* <Button size="large" type="outline" onClick={() => handlerAddExample()}>
                            Create new graph example
                        </Button> */}
                </div>
            </div>
        </div>
    );
};
