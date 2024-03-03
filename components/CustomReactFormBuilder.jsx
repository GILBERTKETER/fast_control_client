import dynamic from 'next/dynamic';

const ReactFormBuilder = dynamic(
    () => import('react-form-builder2').then(mod => mod.ReactFormBuilder),
    { ssr: false }
);

export const CustomReactFormBuilder = ({ initialData, ...utilProps }) => {
    return initialData && <ReactFormBuilder data={initialData} {...utilProps} />;
};
