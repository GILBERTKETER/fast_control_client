export function mapDataTypeToElement(data_type) {
    switch (data_type) {
        case 'INTEGER':
            return 'NumberInput';
        case 'SMALLINT':
            return 'NumberInput';
        case 'BIGINT':
            return 'NumberInput';
        case 'NUMERIC':
            return 'NumberInput';
        case 'FLOAT':
            return 'NumberInput';
        case 'DOUBLE':
            return 'NumberInput';
        case 'BOOLEAN':
            return 'Checkboxes';
        case 'CHARACTER':
            return 'TextInput';
        case 'VARCHAR':
            return 'TextArea';
        case 'TEXT':
            return 'TextArea';
        case 'DATE':
            return 'DatePicker';
        case 'TIME':
            return 'DatePicker';
        case 'TIMESTAMP':
            return 'DatePicker';
        case 'JSON':
            return 'FileUpload';
        case 'BLOB':
            return 'FileUpload';
        case 'CHOICE':
            return 'Checkboxes';
        default:
            return 'TextInput';
    }
}

export function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()];
}
