import {
    Button,
    Space,
    Popconfirm,
    Input,
    Switch,
    Dropdown,
    Menu,
    Notification,
    Link as ArcoLink,
} from '@arco-design/web-react';
import { IconSunFill, IconMoonFill, IconLeft, IconLaunch } from '@arco-design/web-react/icon';
import Link from 'next/link';
import graphState from '../hooks/use-graph-state';
import { useFormBuilderCtx } from '../hooks/use-form-builder-ctx';
import { useRouter } from 'next/router';

/**
 * It renders a nav bar with a title, a save button, a demo button, a clear button, an export button,
 * and a name input
 * @param props - the props passed to the component
 * @returns A Nav component that takes in a title, a save button, a demo button, a clear button, an export button
 */
export default function FormNav({
    setShowModal,
    setShowDrawer,
    previewClickHandler,
    saveClickHandler,
}) {
    const { name, setName, theme, setTheme, setTableDict, setLinkDict, version } =
        graphState.useContainer();
    const { setFormName, getFormName } = useFormBuilderCtx();
    const router = useRouter();
    const { id: formId } = router.query;

    // const { updateGraph, addTable, applyVersion } = tableModel();

    return (
        <nav className="nav">
            <Space>
                <Link href="/forms" passHref>
                    <IconLeft style={{ fontSize: 20 }} />
                </Link>
                <Input
                    type="text"
                    value={getFormName()}
                    onChange={value => setFormName(value)}
                    style={{ width: '240px' }}
                />
            </Space>

            <Space>
                <ArcoLink target="_blank" href={`/forms/render/${formId}`}>
                    Open form in new Tab
                    <IconLaunch />
                </ArcoLink>
                <Button
                    size="small"
                    type="primary"
                    shape="round"
                    onClick={() => {
                        previewClickHandler && previewClickHandler();
                    }}
                >
                    Preview Form
                </Button>
                <Button
                    size="small"
                    type="primary"
                    status="success"
                    shape="round"
                    onClick={() => {
                        saveClickHandler && saveClickHandler();
                    }}
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
