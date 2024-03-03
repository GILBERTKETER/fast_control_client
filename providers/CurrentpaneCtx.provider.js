import { useState } from 'react';
import { CurrentPaneCtx } from '../context';

export const CurrentPaneCtxProvider = ({ children }) => {
    const [currentPane, setCurrentPane] = useState({
        id: 'forms',
        component: <></>,
    });

    return (
        <CurrentPaneCtx.Provider value={{ currentPane, setCurrentPane }}>
            {children}
        </CurrentPaneCtx.Provider>
    );
};
