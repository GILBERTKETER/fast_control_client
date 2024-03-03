import Icons from '@ant-design/icons';
const { HolderOutlined } = Icons;
import { useState } from 'react';
// import './styles.scss';

const fields = [
    { name: 'firstName', label: 'First Name' },
    { name: 'lastName', label: 'Last Name' },
];

const initialQuery = {
    combinator: 'and',
    rules: [
        { field: 'firstName', operator: 'beginsWith', value: 'Stev' },
        { field: 'lastName', operator: 'in', value: 'Vai,Vaughan' },
    ],
};

export const FastQueryBuilder = () => {
    const [query, setQuery] = useState(initialQuery);

    return (
        <div>
            <h4>Query</h4>
            <pre>
                <code>{'_'}</code>
            </pre>
        </div>
    );
};
