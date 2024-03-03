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
import { useApplicationsCtx } from '../hooks/use-applications-ctx';

/**
 * It renders a nav bar with a title, a save button, a demo button, a clear button, an export button,
 * and a name input
 * @param props - the props passed to the component
 * @returns A Nav component that takes in a title, a save button, a demo button, a clear button, an export button
 */
export default function ApplicationNav({ setShowModal, setShowDrawer, onClickSaveHandler }) {
    const { name, setName, theme, setTheme, setTableDict, setLinkDict, version } =
        graphState.useContainer();
    const { getAppName, updateAppName } = useApplicationsCtx();

    return (
        <nav className="nav">
            <Space>
                <Link href="/applications" passHref>
                    <IconLeft style={{ fontSize: 20 }} />
                </Link>
                <Input
                    type="text"
                    value={getAppName() ?? '_'}
                    onChange={value => updateAppName(value)}
                    style={{ width: '240px' }}
                />
            </Space>

            <Space>
                <Button
                    size="small"
                    type="primary"
                    status="success"
                    shape="round"
                    onClick={() => onClickSaveHandler && onClickSaveHandler()}
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
