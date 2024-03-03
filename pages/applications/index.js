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
import { addApplication, delApplication, getAllApplications } from '../../data/db';
import AppListNav from '../../components/applist_nav';
import graphState from '../../hooks/use-graph-state';

export const sampleApps = [
    {
        name: 'application 1',
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
        name: 'cool app',
        box: { x: 0, y: 0, w: 1366, h: 654, clientW: 1366, clientH: 654 },
        connectConfig: {
            hostname: 'localhost',
            username: 'root',
            password: '',
            database: 'graph_database',
        },
        createdAt: 1701169162688,
        updatedAt: 1701169162688,
        id: '12',
    },
];

/**
 * It fetches all the Applications from the database and displays them in a list
 * @returns Home component
 */
export default function Home() {
    const router = useRouter();
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const initApps = async () => {
            try {
                const data = await getAllApplications();
                console.log(data);
                if (data && data.length) {
                    data.sort((a, b) => b.createdAt - a.createdAt);
                    setApplications(data);
                }
            } catch (e) {
                console.log(e);
            }
        };
        initApps();
    }, []);

    const deleteApplication = async id => {
        await delApplication(id);
        setApplications(state => state.filter(item => item.id !== id));
    };

    const handlerAddApplication = async () => {
        try {
            const id = await addApplication({
                name: `Untitled application ${applications.length}`,
            });
            if (id) {
                router.push(`/applications/${id}`);
            }
            return;
        } catch (err) {
            console.log(err);
            return;
        }
    };

    return (
        <>
            <Head>
                <title>FastControl</title>
                <meta name="description" content="Web Application design tool" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AppListNav addApplication={() => handlerAddApplication()} />
            <div className="graph-container">
                {applications && applications.length ? (
                    <List
                        className="graph-list"
                        size="large"
                        header="Applications"
                        dataSource={applications}
                        render={(item, index) => (
                            <List.Item
                                key={item.id}
                                extra={
                                    <Space>
                                        <Link href={`/applications/${item.id}`}>
                                            <Button type="primary" icon={<IconEdit />} />
                                        </Link>
                                        <Popconfirm
                                            title="Are you sure to delete this application?"
                                            okText="Yes"
                                            cancelText="No"
                                            position="br"
                                            onOk={() => deleteApplication(item.id)}
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
                        <Button size="large" type="primary" onClick={() => handlerAddApplication()}>
                            Create new application now
                        </Button>
                        <Divider orientation="center">
                            {' '}
                            * Design application with FastControl *{' '}
                        </Divider>
                        {/* <Button size="large" type="outline" onClick={() => handlerAddExample()}>
                            Create new graph example
                        </Button> */}
                    </div>
                )}
            </div>
        </>
    );
}
