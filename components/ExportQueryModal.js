import { Checkbox, Modal, Tabs, Link } from '@arco-design/web-react';
import Editor from '@monaco-editor/react';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { formatQuery } from 'react-querybuilder';
import { useQueryBuilderCtx } from '../hooks/use-query-builder-ctx';
import { runQuery } from '../data/db';
import { useApplicationsCtx } from '../hooks/use-applications-ctx';
import { IconLaunch } from '@arco-design/web-react/icon';
import { useRouter } from 'next/router';

export const PreviewQueryModal = ({ visible, onCancelHandler, query }) => {
    const [previewConfig, setPreviewConfig] = useState({
        mode: 'sql',
        value: '',
        result: '',
    });
    const { getTable, updateQueryString } = useQueryBuilderCtx();
    const { applicationsCtx } = useApplicationsCtx();
    const [queryOutput, setQueryOutput] = useState('');
    const router = useRouter();
    const { id: queryId } = router.query;

    useEffect(() => {
        if (query) {
            const tableIds = Object.keys(query);
            const resolved_queries = tableIds
                .map(table_query_id => {
                    const targetTable = getTable(table_query_id);
                    // console.log(query[table_query_id]);
                    return targetTable
                        ? `SELECT * FROM ${targetTable.name} WHERE ${formatQuery(
                              query[table_query_id] ?? '',
                              'sql'
                          )}`
                        : null;
                })
                .filter(_not_null => _not_null);
            const finalQueryString = resolved_queries.join('\nUNION\n');
            setPreviewConfig(prev => ({
                ...prev,
                // value: formatQuery(query, previewConfig.mode ?? 'sql'),
                value: finalQueryString,
            }));

            updateQueryString(finalQueryString);
        }
    }, [query, previewConfig.mode]);

    function switchTabPane(pane) {
        if (pane && previewConfig.mode !== pane) {
            setPreviewConfig(prev => ({
                ...prev,
                mode: pane,
            }));
        }
    }

    async function handleExecuteQuery() {
        if (previewConfig?.value?.length > 0) {
            // send request to execute query
            const queryResponse = await runQuery(
                previewConfig.value,
                applicationsCtx?.connectionConfig
            );

            const parsedQueryResponse = queryResponse
                ?.map(qr_ => qr_?.result?.map(qr_result => JSON.stringify(qr_result)))
                .join('');

            setQueryOutput(parsedQueryResponse);
            return;
        }

        return;
    }

    function renderFooter() {
        return (
            <div style={{ display: 'flex', width: '100%' }}>
                {/* {previewConfig.mode === 'sql' && <Checkbox>Parameterized</Checkbox>} */}
                {previewConfig.mode === 'output' && (
                    <Link target="_blank" href={`/querys/render/${queryId}`} icon={<IconLaunch />}>
                        View Query Output
                    </Link>
                )}
                <Button type="primary" onClick={handleExecuteQuery}>
                    Execute Query
                </Button>
            </div>
        );
    }

    function getLanguage() {
        switch (previewConfig.mode) {
            case 'parameterized':
                return 'json';
            case 'json_without_ids':
                return 'json';
            case 'output':
                return 'plaintext';
            default:
                return previewConfig.mode;
        }
    }

    return (
        <Modal
            title={'Query Preview'}
            visible={visible}
            onCancel={() => onCancelHandler && onCancelHandler()}
            footer={renderFooter()}
            style={{ width: 'fit-content' }}
        >
            <Tabs onChange={val => switchTabPane(val)}>
                <Tabs.TabPane key="sql" title="SQL" />
                {/* <Tabs.TabPane key="json" title="JSON" />
                <Tabs.TabPane key="parameterized" title="Parameterized SQL" disabled />
                <Tabs.TabPane key="json_without_ids" title="JSON without ids" /> */}
                <Tabs.TabPane key="output" title="Output" />
            </Tabs>
            <Editor
                value={previewConfig.mode === 'output' ? queryOutput : previewConfig.value}
                language={getLanguage()}
                width={'680px'}
                height={'60vh'}
                options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollbar: {
                        // 滚动条设置
                        verticalScrollbarSize: 6, // 竖滚动条
                        horizontalScrollbarSize: 6, // 横滚动条
                    },
                    lineNumbers: 'on', // 控制行号的出现on | off
                }}
            />
        </Modal>
    );
};
