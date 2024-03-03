import { useCurrentPane } from '../../../hooks/use-current-pane';
import { Forms } from './Forms';
import { Queries } from './Queries';

export const CurrentPane = () => {
    const { currentPane, switchPane } = useCurrentPane();

    function renderCurrentPane() {
        switch (currentPane.id) {
            case 'forms':
                return <Forms />;
            default:
                return <Queries />;
        }
    }
    return <div className="acw-content">{renderCurrentPane()}</div>;
};
