import { Space, Button, Switch, Popconfirm } from '@arco-design/web-react';
import { IconSunFill, IconMoonFill } from '@arco-design/web-react/icon';
import Link from 'next/link';
import graphState from '../hooks/use-graph-state';

/**
 * It renders a nav bar with a link to the home page, a button to add a new graph, and a dropdown menu
 * with a list of import options
 * @param props - the props passed to the component
 * @returns List Nav component
 */
export default function AppListNav({ addApplication }) {
    const { theme, setTheme } = graphState.useContainer();

    return (
        <div className="nav">
            <div>
                <Link href="/" passHref>
                    <strong>FastControl</strong> | Web Application design tool
                </Link>
            </div>
            <Space>
                <Button size="small" type="primary" shape="round" onClick={() => addApplication()}>
                    + New application
                </Button>
                {/* <Button size="small" shape="round" onClick={() => addExample()}>
                    Example graph
                </Button> */}
                <Switch
                    checkedIcon={<IconMoonFill />}
                    uncheckedIcon={<IconSunFill />}
                    checked={theme === 'dark'}
                    onChange={e => setTheme(e ? 'dark' : 'light')}
                />
            </Space>
        </div>
    );
}
