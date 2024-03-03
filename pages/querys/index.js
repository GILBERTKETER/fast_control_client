import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
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
import { useState, useEffect } from 'react';
import { addQuery, delQuery, getAllQueries, deleteAllQuerys, getQuery } from '../../data/db';
import northwindTraders from '../../data/example/northwind_traders.json';
import blog from '../../data/example/blog.json';
import spaceX from '../../data/example/spacex.json';

import graphState from '../../hooks/use-graph-state';
import { Parser } from '@dbml/core';
import QueryListNav from '../../components/querylist_nav';

const ImportModal = dynamic(() => import('../../components/import_modal'), { ssr: false });

/**
 * It fetches all the querys from the database and displays them in a list
 * @returns Home component
 */
export default function Home() {
    const router = useRouter();
    const [querys, setQuerys] = useState([]);
    const [showModal, setShowModal] = useState('');
    const { setTableDict, setLinkDict, tableList } = graphState.useContainer();

    useEffect(() => {
        const initQuerys = async () => {
            try {
                const data = await getAllQueries();
                if (data && data.length) {
                    data.sort((a, b) => b.createdAt - a.createdAt);
                    setQuerys(data);
                }
            } catch (e) {
                console.log(e);
            }
        };
        initQuerys();
    }, []);

    const deleteQuery = async id => {
        await delQuery(id);
        setQuerys(state => state.filter(item => item.id !== id));
    };

    const handlerAddQuery = async () => {
        const id = await addQuery({ name: `Untitled query ${querys.length}` });

        if (id) {
            // router.push(`/querys/${id}`);
        }
    };

    useEffect(() => {
        getQuery(5).then(res => {
            console.log(res);
        });
    }, []);

    return (
        <>
            <Head>
                <title>FastControl</title>
                <meta name="description" content="Web Application design tool" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <QueryListNav addQuery={() => handlerAddQuery()} />
            <div className="graph-container">
                {querys && querys.length ? (
                    <List
                        className="query-list"
                        size="large"
                        header="Querys"
                        dataSource={querys}
                        render={(item, index) => (
                            <List.Item
                                key={item.id}
                                extra={
                                    <Space>
                                        <Link href={`/querys/${item?.id}?appId=${item?.appId}`}>
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
                                            {item?.name?.length > 0 ? item?.name[0] : '_'}
                                        </Avatar>
                                    }
                                    title={item?.name ?? '_'}
                                    description={
                                        <Space style={{ marginTop: 4 }}>
                                            {/* {item.tableDict ? (
                                                <Tag color="arcoblue" icon={<IconNav />}>
                                                    {Object.keys(item.tableDict).length} tables
                                                </Tag>
                                            ) : null} */}
                                            <Tag color="green" icon={<IconCopy />}>
                                                createdAt{' '}
                                                {new Date(item?.createdAt).toLocaleString()}
                                            </Tag>
                                            <Tag color="gold" icon={<IconCalendarClock />}>
                                                updatedAt{' '}
                                                {new Date(item?.updatedAt).toLocaleString()}
                                            </Tag>
                                        </Space>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <div className="graph-list-btns">
                        <Button size="large" type="primary" onClick={() => handlerAddQuery()}>
                            Create new query now
                        </Button>
                        <Divider orientation="center"> * Design query with FastControl * </Divider>
                        {/* <Button size="large" type="outline" onClick={() => handlerAddExample()}>
                            Create new query example
                        </Button> */}
                    </div>
                )}
            </div>
            <ImportModal
                showModal={showModal}
                onCloseModal={() => setShowModal('')}
                cb={args => handlerImportQuery(args)}
            />
        </>
    );
}
