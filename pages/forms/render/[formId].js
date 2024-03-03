import dynamic from 'next/dynamic';
import { SERVER_URL } from '../../../config';
import 'react-form-builder2/dist/app.css';
import Head from 'next/head';

const ReactFormGenerator = dynamic(
    () => import('../../../react-form-builder').then(mod => mod.ReactFormGenerator),
    { ssr: false }
);

export default function FormRenderPage({ task_data, formId, form_action_url }) {
    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                    integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                    crossorigin="anonymous"
                ></link>
            </Head>
            <div className="app-content" style={{ padding: '10px' }}>
                <ReactFormGenerator
                    data={task_data ?? []}
                    form_action={form_action_url}
                    form_method={'POST'}
                    task_id={formId}
                    submitButton={
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    }
                />
            </div>
        </>
    );
}

const getForm = async id => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/getForm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }), // Replace with your desired data to send
        });

        const data = await response.json();

        const { formJSON: form } = JSON.parse(data?.formData?.form);

        return { ...form, id: data?.formData?.id ?? '_' };
    } catch (e) {
        console.log(e);
        return null;
    }
};

const getApplication = async id => {
    try {
        const response = await fetch(`${SERVER_URL}/backend/index.php/api/getApplication`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }), // Replace with your desired data to send
        });

        const data = await response.json();

        const app = {
            ...JSON.parse(data?.applicationData?.application).appJSON,
            id: data?.applicationData?.id ?? '_',
        };
        // console.log(app);
        return app;
    } catch (e) {
        console.log(e);
        return null;
    }
};

export async function getServerSideProps(ctx) {
    // get form details then pass them to the page for rendering in the form generator
    try {
        const { req } = ctx;
        const { formId } = ctx.query;

        //

        const isHTTPS = req.headers['x-forwarded-proto'] === 'https' || req.protocol === 'https';

        const fullURL = (isHTTPS ? 'https://' : 'http://') + ctx.req.headers.host + ctx.resolvedUrl;

        if (!formId) {
            return {
                props: {},
            };
        }

        const targetForm = await getForm(formId);

        if (!targetForm) {
            return {
                props: {},
            };
        }

        return {
            props: {
                formId,
                task_data: targetForm?.task_data ?? [],
                form_action_url: `${SERVER_URL}/backend/index.php/api/submitForm?formId=${formId}&tableName=${
                    targetForm?.tableName ?? null
                }&redirect=${fullURL ?? ''}`,
            },
        };
    } catch (err) {
        console.log(err);
        return {
            props: {},
        };
    }
}
