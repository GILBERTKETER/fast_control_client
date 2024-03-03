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
import graphState from '../hooks/use-graph-state';
import { useQueryBuilderCtx } from '../hooks/use-query-builder-ctx';

/**
 * It renders a nav bar with a title, a save button, a demo button, a clear button, an export button,
 * and a name input
 * @param props - the props passed to the component
 * @returns A Nav component that takes in a title, a save button, a demo button, a clear button, an export button
 */
export default function QueryNav({
    setShowModal,
    setShowDrawer,
    saveClickHandler,
    previewClickHandler,
}) {
    const { name, setName, theme, setTheme, setTableDict, setLinkDict, version } =
        graphState.useContainer();
    const { getQueryName, setQueryName } = useQueryBuilderCtx();

    return (
        <nav className="nav">
            <Space>
                <Link href="/querys" passHref>
                    <IconLeft style={{ fontSize: 20 }} />
                </Link>
                <Input
                    type="text"
                    value={getQueryName()}
                    onChange={value => setQueryName(value)}
                    style={{ width: '240px' }}
                />
            </Space>

            <Space>
                <Button
                    size="small"
                    type="outline"
                    shape="round"
                    onClick={() => {
                        previewClickHandler && previewClickHandler();
                    }}
                >
                    Preview query
                </Button>
                <Button
                    size="small"
                    type="primary"
                    status="success"
                    shape="round"
                    onClick={() => saveClickHandler && saveClickHandler()}
                >
                    Save
                </Button>
                <Button
                    size="small"
                    type="outline"
                    shape="round"
                    onClick={() => setShowDrawer('config')}
                >
                    Config
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
