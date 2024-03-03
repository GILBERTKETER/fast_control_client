import { useContext } from 'react';
import { CurrentPaneCtx } from '../context';

export function useCurrentPane() {
    const { currentPane, setCurrentPane } = useContext(CurrentPaneCtx);

    function switchPane(pane) {
        if (pane) {
            setCurrentPane(pane);
        }
    }

    return {
        currentPane,
        switchPane,
    };
}
