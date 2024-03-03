import { Checkbox, Modal } from '@arco-design/web-react';
import { useQueryBuilderCtx } from '../../hooks/use-query-builder-ctx';

export const AddTableModal = ({ visible, onCancelHandler }) => {
    const { getAvailableTables, populateSelectedTables, getSelectedTables } = useQueryBuilderCtx();
    return (
        <Modal
            title={'Select Tables'}
            visible={visible}
            onCancel={() => {
                onCancelHandler && onCancelHandler();
            }}
            footer={null}
        >
            <Checkbox.Group
                options={getAvailableTables().map(table => ({
                    label: table?.name ?? '_',
                    value: table?.id ?? null,
                }))}
                direction="vertical"
                onChange={tableIds => {
                    populateSelectedTables(tableIds);
                }}
                defaultValue={getSelectedTables().map(table => table?.id)}
            ></Checkbox.Group>
        </Modal>
    );
};
