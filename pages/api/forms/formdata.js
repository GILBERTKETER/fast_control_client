import { isJsonString, readFromJSONObjectFile, writeToJSONFile } from '../../../utils/node-helpers';

const FORM_DATA_BASE_PATH = '.';

export default async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const { task_data = {} } = req.body;
            const { formId, tableId, appId } = req.query;

            if (formId && tableId) {
                // check whether the file with formId exists already
                // create a new file if not
                // write to JSON file
                const targetPath = `${FORM_DATA_BASE_PATH}/${formId}.json`;

                const formDataConstruct = {
                    formId,
                    tableId,
                    appId,
                    task_data,
                };

                await writeToJSONFile(targetPath, formDataConstruct, true);

                return res.status(200).json({});
            }

            return res.status(400).json({});
        } else {
            const { formId } = req.query;

            if (formId) {
                const targetPath = `${FORM_DATA_BASE_PATH}/${formId}.json`;

                // check if the file exists
                const JSON_FORM_DATA = await readFromJSONObjectFile(targetPath);

                const parsedFormData = isJsonString(JSON_FORM_DATA)
                    ? JSON.parse(JSON_FORM_DATA)
                    : {};

                return res.status(200).json(parsedFormData);
            }
            return res.status(400).json({});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({});
    }
}
