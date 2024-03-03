import { Modal, Select } from '@arco-design/web-react';
import { useFormBuilderCtx } from '../../hooks/use-form-builder-ctx';

export const ChangeFormInputFieldModal = ({ visible, onCancelHandler, field }) => {
    const availableFormInputChange = [
        {
            label: 'Dropdown',
            value: 'Dropdown',
        },
        {
            label: 'Select',
            value: 'Checkboxes',
        },
        {
            label: 'Radio',
            value: 'RadioButtons',
        },
    ];
    const { formBuilderCtx, changeCustomFieldInput } = useFormBuilderCtx();

    return (
        <Modal
            visible={visible}
            onCancel={() => {
                onCancelHandler && onCancelHandler();
            }}
            footer={null}
            title={`Change Field(${field?.name ?? '_'}) Input`}
        >
            <Select
                defaultValue={formBuilderCtx.customFieldInputs[field?.id]?.element ?? 'Dropdown'}
                onChange={val => {
                    changeCustomFieldInput(field.id, { element: val });
                }}
            >
                {availableFormInputChange.map((input_elm, ix) => {
                    return (
                        <Select.Option key={ix} value={input_elm.value}>
                            {input_elm.label}
                        </Select.Option>
                    );
                })}
            </Select>
        </Modal>
    );
};
