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
import { addForm, delForm, getAllForms, deleteAllForms } from '../../data/db';
import FormListNav from '../../components/formlist_nav';
import northwindTraders from '../../data/example/northwind_traders.json';
import blog from '../../data/example/blog.json';
import spaceX from '../../data/example/spacex.json';

import graphState from '../../hooks/use-graph-state';
import { Parser } from '@dbml/core';

const ImportModal = dynamic(() => import('../../components/import_modal'), { ssr: false });

/**
 * It fetches all the forms from the database and displays them in a list
 * @returns Home component
 */
export default function Home() {
    const router = useRouter();
    const [forms, setForms] = useState([]);
    const [showModal, setShowModal] = useState('');
    const { setTableDict, setLinkDict, tableList } = graphState.useContainer();

    useEffect(() => {
        const initForms = async () => {
            try {
                const data = await getAllForms();
                if (data && data.length) {
                    data.sort((a, b) => b.createdAt - a.createdAt);
                    setForms(data);
                }
            } catch (e) {
                console.log(e);
            }
        };
        initForms();
    }, []);

    const deleteForm = async id => {
        await delForm(id);
        setForms(state => state.filter(item => item.id !== id));
    };

    const handlerAddForm = async () => {
        const id = await addForm({ name: `Untitled form ${forms.length}` });
        if (id) {
            router.push(`/forms/${id}`);
        }
    };

    return (
        <>
            <Head>
                <title>FastControl</title>
                <meta name="description" content="Web Application design tool" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <FormListNav addForm={() => handlerAddForm()} />
            <div className="graph-container">
                {forms && forms.length ? (
                    <List
                        className="graph-list"
                        size="large"
                        header="Forms"
                        dataSource={forms}
                        render={(item, index) => (
                            <List.Item
                                key={item.id}
                                extra={
                                    <Space>
                                        <Link href={`/forms/${item?.id}?appId=${item?.appId}`}>
                                            <Button type="primary" icon={<IconEdit />} />
                                        </Link>
                                        <Popconfirm
                                            title="Are you sure to delete this form?"
                                            okText="Yes"
                                            cancelText="No"
                                            position="br"
                                            onOk={() => deleteForm(item.id)}
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
                                            {item?.tables ? (
                                                <Tag color="arcoblue" icon={<IconNav />}>
                                                    {item?.tables?.length} tables
                                                </Tag>
                                            ) : null}
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
                        <Button size="large" type="primary" onClick={() => handlerAddForm()}>
                            Create new form now
                        </Button>
                        <Divider orientation="center"> * Design Form with FastControl * </Divider>
                        {/* <Button size="large" type="outline" onClick={() => handlerAddExample()}>
                            Create new graph example
                        </Button> */}
                    </div>
                )}
            </div>
            <ImportModal
                showModal={showModal}
                onCloseModal={() => setShowModal('')}
                cb={args => handlerImportForm(args)}
            />
        </>
    );
}
