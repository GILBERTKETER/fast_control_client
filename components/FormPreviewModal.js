import { Space } from '@arco-design/web-react';
import { Modal, Button } from '@arco-design/web-react';
import dynamic from 'next/dynamic';
import { IconLaunch } from '@arco-design/web-react/icon';
import { useRouter } from 'next/router';
import { Link } from '@arco-design/web-react';

const ReactFormGenerator = dynamic(
    () => import('../react-form-builder').then(mod => mod.ReactFormGenerator),
    { ssr: false }
);

export const FormPreviewModal = ({
    formName,
    taskData,
    visible,
    onCancelHandler,
    formId,
    ...utilProps
}) => {
    const router = useRouter();
    return (
        <Modal
            title={formName ?? '_'}
            visible={visible}
            onCancel={() => {
                onCancelHandler && onCancelHandler();
            }}
            footer={null}
        >
            {/* <Space> */}
            <ReactFormGenerator
                data={taskData ?? []}
                submitButton={
                    <>
                        <Button type="primary" onClick={() => {}}>
                            Submit
                        </Button>
                        <Link target="_blank" href={`/forms/render/${formId}`}>
                            Open form in new Tab
                            <IconLaunch />
                        </Link>
                    </>
                }
                {...utilProps}
            />
            {/* </Space> */}
        </Modal>
    );
};
