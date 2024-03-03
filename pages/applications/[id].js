import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import ContextMenu from '../../components/context_menu';
import ConfigDrawer from '../../components/config';
import ApplicationNav from '../../components/application_nav';
import { Menu } from '@arco-design/web-react';
import { IconMindMapping, IconFile } from '@arco-design/web-react/icon';
import { CurrentPane } from '../../components/applications/panes';
import { useCurrentPane } from '../../hooks/use-current-pane';
import dynamic from 'next/dynamic';
import { useApplicationsCtx } from '../../hooks/use-applications-ctx';
import { useRouter } from 'next/router';
import { getApplication, saveApplication } from '../../data/db';
import ApplicationConfigDrawer from '../../components/ApplicationConfigDrawer';

const graphState = dynamic(
    () => import('../../hooks/use-graph-state').then(graphS_ => graphS_.default.useContainer),
    { ssr: false }
);

export default function Home() {
    const { box, setBox, version } = graphState;
    const { applicationsCtx, resetConfig, updateConnectionConfig, updateAppName } =
        useApplicationsCtx();

    const svg = useRef();

    const [showModal, setShowModal] = useState('');
    const [showDrawer, setShowDrawer] = useState('');
    const [sideNavLinks, setSideNavLinks] = useState([
        {
            label: 'Forms',
            id: 'forms',
            icon: <IconFile />,
        },
        {
            label: 'Queries',
            id: 'queries',
            icon: <IconMindMapping />,
        },
    ]);
    const { currentPane, switchPane } = useCurrentPane();
    const router = useRouter();
    const { id: appId } = router.query;

    /**
     * It takes a mouse event and returns the cursor position in SVG coordinates
     * @returns The cursor position in the SVG coordinate system.
     */
    const getSVGCursor = ({ clientX, clientY }) => {
        if (!svg.current) {
            return null;
        }
        let point = svg.current.createSVGPoint();
        point.x = clientX;
        point.y = clientY;

        return point.matrixTransform(svg.current.getScreenCTM().inverse());
    };

    /**
     * `wheelHandler` is a function that takes an event object as an argument and returns a function
     * that takes a state object as an argument and returns a new state object
     */
    const wheelHandler = e => {
        let { deltaY, deltaX } = e;
        const cursor = getSVGCursor(e);

        if (!e.ctrlKey) {
            setBox(state => {
                if (state.w > 4000 && deltaY > 0) return state;
                if (state.w < 600 && deltaY < 0) return state;

                return {
                    x: state.x + deltaX,
                    y: state.y + deltaY,
                    w: state.w,
                    h: state.h,
                    clientH: state.clientH,
                    clientW: state.clientW,
                };
            });
        } else {
            setBox(state => {
                if (state.w > 4000 && deltaY > 0) return state;
                if (state.w < 600 && deltaY < 0) return state;

                deltaY = deltaY * 2;
                deltaX = deltaY * (state.w / state.h);

                const deltaLimit = 600;

                if (deltaY > deltaLimit) {
                    deltaY = deltaY > deltaLimit ? deltaLimit : deltaY;
                    deltaX = deltaY * (state.w / state.h);
                } else if (deltaY < -deltaLimit) {
                    deltaY = deltaY < -deltaLimit ? -deltaLimit : deltaY;
                    deltaX = deltaY * (state.w / state.h);
                }

                return {
                    x: state.x - ((cursor.x - state.x) / state.w) * deltaX,
                    y: state.y - ((cursor.y - state.y) / state.h) * deltaY,
                    w: state.w + deltaX,
                    h: state.h + deltaY,
                    clientH: state.clientH,
                    clientW: state.clientW,
                };
            });
        }

        e.preventDefault();
    };

    useEffect(() => {
        if (svg.current) {
            const instance = svg.current;
            instance.addEventListener('wheel', wheelHandler, { passive: false });
            return () => {
                instance.removeEventListener('wheel', wheelHandler, {
                    passive: false,
                });
            };
        }
    }, [version]);

    useHotkeys('ctrl+s, meta+s', () => updateForm(), { preventDefault: true }, [
        // tableDict,
        // linkDict,
        // name,
    ]);

    function handleSwitchPane(id) {
        if (id) {
            const targetPane = sideNavLinks.find(pn => pn.id == id);
            if (targetPane) {
                switchPane(targetPane);
            }
        }
        return id;
    }

    async function handleApplicationSave() {
        if (appId) {
            await saveApplication({ ...(applicationsCtx ?? {}) }, appId);
        }
    }

    // useEffect(() => {
    //     getApplication(appId);
    // }, []);

    useEffect(() => {
        const initApplication = async () => {
            if (appId) {
                const targetApp = await getApplication(appId);

                if (targetApp?.connectionConfig) {
                    updateConnectionConfig(targetApp.connectionConfig);
                }

                if (targetApp?.name) {
                    updateAppName(targetApp.name);
                }
            }
        };

        initApplication();
    }, [appId]);

    return (
        <div className="graph">
            <Head>
                <title>FastControl</title>
                <meta name="description" content="Web Application design tool" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ContextMenu setShowModal={setShowModal}></ContextMenu>
            <ApplicationNav
                setShowModal={setShowModal}
                setShowDrawer={setShowDrawer}
                onClickSaveHandler={handleApplicationSave}
            />
            <ApplicationConfigDrawer
                showDrawer={showDrawer}
                onCloseDrawer={() => setShowDrawer('')}
            />
            <div className="app-content">
                <div className="ac-sidenav-wrapper">
                    <div className="acsw-content">
                        {/* <ul>
                            {sideNavLinks.map(snl => {
                                return (
                                    <li
                                        onClick={() => {
                                            handleSwitchPane(snl.id);
                                        }}
                                    >
                                        {snl.label}
                                    </li>
                                );
                            })}
                        </ul> */}
                        <Menu>
                            {sideNavLinks.map((snl, ix) => {
                                return (
                                    <Menu.Item
                                        key={ix}
                                        onClick={e => {
                                            handleSwitchPane(snl.id);
                                        }}
                                    >
                                        <span>{snl.icon}</span>
                                        {snl.label}
                                    </Menu.Item>
                                );
                            })}
                        </Menu>
                    </div>
                </div>
                <div className="ac-window">
                    <CurrentPane />
                </div>
            </div>
        </div>
    );
}
